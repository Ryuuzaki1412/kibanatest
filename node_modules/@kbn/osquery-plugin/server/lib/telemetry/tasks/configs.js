"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryConfigsTaskConfig = createTelemetryConfigsTaskConfig;
var _constants = require("../constants");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryConfigsTaskConfig() {
  return {
    type: 'osquery:telemetry-configs',
    title: 'Osquery Configs Telemetry',
    interval: '24h',
    timeout: '10m',
    version: '1.1.0',
    runTask: async (taskId, logger, receiver, sender) => {
      const configsResponse = await receiver.fetchConfigs();
      if (!(configsResponse !== null && configsResponse !== void 0 && configsResponse.total)) {
        logger.debug('no configs found');
        return;
      }
      const configsJson = (0, _helpers.templateConfigs)(configsResponse === null || configsResponse === void 0 ? void 0 : configsResponse.items);
      configsJson.forEach(config => {
        sender.reportEvent(_constants.TELEMETRY_EBT_CONFIG_EVENT, config);
      });
    }
  };
}