"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugTelemetryRoute = void 0;
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _apm_telemetry = require("../../lib/apm_telemetry");
var _apm_saved_object_constants = require("../../../common/apm_saved_object_constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const debugTelemetryRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/debug-telemetry',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async resources => {
    var _plugins$taskManager, _taskManagerStart$run;
    const {
      plugins,
      context
    } = resources;
    const coreContext = await context.core;
    const taskManagerStart = await ((_plugins$taskManager = plugins.taskManager) === null || _plugins$taskManager === void 0 ? void 0 : _plugins$taskManager.start());
    const savedObjectsClient = coreContext.savedObjects.client;
    await (taskManagerStart === null || taskManagerStart === void 0 ? void 0 : (_taskManagerStart$run = taskManagerStart.runSoon) === null || _taskManagerStart$run === void 0 ? void 0 : _taskManagerStart$run.call(taskManagerStart, _apm_telemetry.APM_TELEMETRY_TASK_NAME));
    const apmTelemetryObject = await savedObjectsClient.get(_apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_ID);
    return apmTelemetryObject.attributes;
  }
});
exports.debugTelemetryRoute = debugTelemetryRoute;