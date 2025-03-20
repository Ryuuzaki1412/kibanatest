"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetryConfiguration = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TelemetryConfiguration {
  constructor() {
    (0, _defineProperty2.default)(this, "DEFAULT_TELEMETRY_MAX_BUFFER_SIZE", 100);
    (0, _defineProperty2.default)(this, "DEFAULT_MAX_SECURITY_LIST_TELEMETRY_BATCH", 100);
    (0, _defineProperty2.default)(this, "DEFAULT_MAX_ENDPOINT_TELEMETRY_BATCH", 300);
    (0, _defineProperty2.default)(this, "DEFAULT_MAX_DETECTION_RULE_TELEMETRY_BATCH", 1_000);
    (0, _defineProperty2.default)(this, "DEFAULT_MAX_DETECTION_ALERTS_BATCH", 50);
    (0, _defineProperty2.default)(this, "_telemetry_max_buffer_size", this.DEFAULT_TELEMETRY_MAX_BUFFER_SIZE);
    (0, _defineProperty2.default)(this, "_max_security_list_telemetry_batch", this.DEFAULT_MAX_SECURITY_LIST_TELEMETRY_BATCH);
    (0, _defineProperty2.default)(this, "_max_endpoint_telemetry_batch", this.DEFAULT_MAX_ENDPOINT_TELEMETRY_BATCH);
    (0, _defineProperty2.default)(this, "_max_detection_rule_telemetry_batch", this.DEFAULT_MAX_DETECTION_RULE_TELEMETRY_BATCH);
    (0, _defineProperty2.default)(this, "_max_detection_alerts_batch", this.DEFAULT_MAX_DETECTION_ALERTS_BATCH);
  }
  get telemetry_max_buffer_size() {
    return this._telemetry_max_buffer_size;
  }
  set telemetry_max_buffer_size(num) {
    this._telemetry_max_buffer_size = num;
  }
  get max_security_list_telemetry_batch() {
    return this._max_security_list_telemetry_batch;
  }
  set max_security_list_telemetry_batch(num) {
    this._max_security_list_telemetry_batch = num;
  }
  get max_endpoint_telemetry_batch() {
    return this._max_endpoint_telemetry_batch;
  }
  set max_endpoint_telemetry_batch(num) {
    this._max_endpoint_telemetry_batch = num;
  }
  get max_detection_rule_telemetry_batch() {
    return this._max_detection_rule_telemetry_batch;
  }
  set max_detection_rule_telemetry_batch(num) {
    this._max_detection_rule_telemetry_batch = num;
  }
  get max_detection_alerts_batch() {
    return this._max_detection_alerts_batch;
  }
  set max_detection_alerts_batch(num) {
    this._max_detection_alerts_batch = num;
  }
  resetAllToDefault() {
    this._telemetry_max_buffer_size = this.DEFAULT_TELEMETRY_MAX_BUFFER_SIZE;
    this._max_security_list_telemetry_batch = this.DEFAULT_MAX_SECURITY_LIST_TELEMETRY_BATCH;
    this._max_endpoint_telemetry_batch = this.DEFAULT_MAX_ENDPOINT_TELEMETRY_BATCH;
    this._max_detection_rule_telemetry_batch = this.DEFAULT_MAX_DETECTION_RULE_TELEMETRY_BATCH;
    this._max_detection_alerts_batch = this.DEFAULT_MAX_DETECTION_ALERTS_BATCH;
  }
}
const telemetryConfiguration = new TelemetryConfiguration();
exports.telemetryConfiguration = telemetryConfiguration;