"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryEventsSender = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _axios = _interopRequireDefault(require("axios"));
var _queue = require("./queue");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Simplified version of https://github.com/elastic/kibana/blob/master/x-pack/plugins/security_solution/server/lib/telemetry/sender.ts
 * Sends batched events to telemetry v3 api
 */
class TelemetryEventsSender {
  // Assume true until the first check

  constructor(logger) {
    (0, _defineProperty2.default)(this, "initialCheckDelayMs", 10 * 1000);
    (0, _defineProperty2.default)(this, "checkIntervalMs", 30 * 1000);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "telemetryStart", void 0);
    (0, _defineProperty2.default)(this, "telemetrySetup", void 0);
    (0, _defineProperty2.default)(this, "intervalId", void 0);
    (0, _defineProperty2.default)(this, "isSending", false);
    (0, _defineProperty2.default)(this, "queuesPerChannel", {});
    (0, _defineProperty2.default)(this, "isOptedIn", true);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "clusterInfo", void 0);
    (0, _defineProperty2.default)(this, "licenseInfo", void 0);
    (0, _defineProperty2.default)(this, "transformDataToNdjson", data => {
      if (data.length !== 0) {
        const dataString = data.map(dataItem => JSON.stringify(dataItem)).join('\n');
        return `${dataString}\n`;
      } else {
        return '';
      }
    });
    this.logger = logger;
  }
  setup(telemetrySetup) {
    this.telemetrySetup = telemetrySetup;
  }
  async start(telemetryStart, core) {
    this.telemetryStart = telemetryStart;
    this.esClient = core === null || core === void 0 ? void 0 : core.elasticsearch.client.asInternalUser;
    this.clusterInfo = await this.fetchClusterInfo();
    this.licenseInfo = await this.fetchLicenseInfo();
    this.logger.debug(`Starting local task`);
    setTimeout(() => {
      this.sendIfDue();
      this.intervalId = setInterval(() => this.sendIfDue(), this.checkIntervalMs);
    }, this.initialCheckDelayMs);
  }
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  queueTelemetryEvents(channel, events) {
    if (!this.queuesPerChannel[channel]) {
      this.queuesPerChannel[channel] = new _queue.TelemetryQueue();
    }
    this.queuesPerChannel[channel].addEvents((0, _lodash.cloneDeep)(events));
  }
  async isTelemetryOptedIn() {
    var _this$telemetryStart;
    this.isOptedIn = await ((_this$telemetryStart = this.telemetryStart) === null || _this$telemetryStart === void 0 ? void 0 : _this$telemetryStart.getIsOptedIn());
    return this.isOptedIn === true;
  }
  async sendIfDue() {
    if (this.isSending) {
      return;
    }
    this.isSending = true;
    this.isOptedIn = await this.isTelemetryOptedIn();
    if (!this.isOptedIn) {
      this.logger.debug(`Telemetry is not opted-in.`);
      for (const channel of Object.keys(this.queuesPerChannel)) {
        this.queuesPerChannel[channel].clearEvents();
      }
      this.isSending = false;
      return;
    }
    for (const channel of Object.keys(this.queuesPerChannel)) {
      await this.sendEvents(await this.fetchTelemetryUrl(channel), this.queuesPerChannel[channel]);
    }
    this.isSending = false;
  }
  async fetchClusterInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve cluster information');
    }
    try {
      return await this.esClient.info();
    } catch (e) {
      this.logger.debug(`Error fetching cluster information: ${e}`);
    }
  }
  async fetchLicenseInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve license information');
    }
    try {
      return await this.esClient.license.get();
    } catch (e) {
      this.logger.debug(`Error fetching license information: ${e}`);
    }
  }
  async sendEvents(telemetryUrl, queue) {
    let events = queue.getEvents();
    if (events.length === 0) {
      return;
    }
    events = events.map(event => {
      var _this$licenseInfo;
      return {
        ...event,
        license: (_this$licenseInfo = this.licenseInfo) === null || _this$licenseInfo === void 0 ? void 0 : _this$licenseInfo.license
      };
    });
    try {
      this.logger.debug(`Telemetry URL: ${telemetryUrl}`);
      queue.clearEvents();
      this.logger.debug(JSON.stringify(events));
      await this.send(events, telemetryUrl);
    } catch (err) {
      this.logger.debug(`Error sending telemetry events data: ${err}`);
      queue.clearEvents();
    }
  }

  // Forms URLs like:
  // https://telemetry.elastic.co/v3/send/my-channel-name or
  // https://telemetry-staging.elastic.co/v3/send/my-channel-name
  async fetchTelemetryUrl(channel) {
    var _this$telemetrySetup;
    const telemetryUrl = await ((_this$telemetrySetup = this.telemetrySetup) === null || _this$telemetrySetup === void 0 ? void 0 : _this$telemetrySetup.getTelemetryUrl());
    if (!telemetryUrl) {
      throw Error("Couldn't get telemetry URL");
    }
    if (!telemetryUrl.hostname.includes('staging')) {
      telemetryUrl.pathname = `/v3/send/${channel}`;
    } else {
      telemetryUrl.pathname = `/v3-dev/send/${channel}`;
    }
    return telemetryUrl.toString();
  }
  async send(events, telemetryUrl) {
    var _this$clusterInfo;
    const {
      cluster_name: clusterName,
      cluster_uuid: clusterUuid,
      version: clusterVersion
    } = (_this$clusterInfo = this.clusterInfo) !== null && _this$clusterInfo !== void 0 ? _this$clusterInfo : {};

    // using ndjson so that each line will be wrapped in json envelope on server side
    // see https://github.com/elastic/infra/blob/master/docs/telemetry/telemetry-next-dataflow.md#json-envelope
    const ndjson = this.transformDataToNdjson(events);
    try {
      const resp = await _axios.default.post(telemetryUrl, ndjson, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          ...(clusterUuid ? {
            'X-Elastic-Cluster-ID': clusterUuid
          } : undefined),
          ...(clusterName ? {
            'X-Elastic-Cluster-Name': clusterName
          } : undefined),
          'X-Elastic-Stack-Version': clusterVersion !== null && clusterVersion !== void 0 && clusterVersion.number ? clusterVersion.number : '8.2.0'
        },
        timeout: 5000
      });
      this.logger.debug(`Events sent!. Response: ${resp.status} ${JSON.stringify(resp.data)}`);
    } catch (err) {
      this.logger.debug(`Error sending events: ${err.response.status} ${JSON.stringify(err.response.data)}`);
    }
  }
}
exports.TelemetryEventsSender = TelemetryEventsSender;