"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryPacksTaskConfig = createTelemetryPacksTaskConfig;
var _constants = require("../constants");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryPacksTaskConfig() {
  return {
    type: 'osquery:telemetry-packs',
    title: 'Osquery Packs Telemetry',
    interval: '24h',
    timeout: '10m',
    version: '1.1.0',
    runTask: async (taskId, logger, receiver, sender) => {
      const packsResponse = await receiver.fetchPacks();
      if (!(packsResponse !== null && packsResponse !== void 0 && packsResponse.total)) {
        logger.debug('no packs found');
        return;
      }
      const packsJson = (0, _helpers.templatePacks)(packsResponse === null || packsResponse === void 0 ? void 0 : packsResponse.saved_objects);
      packsJson.forEach(pack => {
        sender.reportEvent(_constants.TELEMETRY_EBT_PACK_EVENT, pack);
      });
    }
  };
}