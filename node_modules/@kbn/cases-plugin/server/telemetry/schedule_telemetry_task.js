"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleCasesTelemetryTask = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MINUTES_ON_HALF_DAY = 60 * 12;
const scheduleCasesTelemetryTask = (taskManager, logger) => {
  taskManager.ensureScheduled({
    id: _constants.CASES_TELEMETRY_TASK_NAME,
    taskType: _constants.CASES_TELEMETRY_TASK_NAME,
    schedule: {
      interval: `${MINUTES_ON_HALF_DAY}m`
    },
    scope: ['cases'],
    params: {},
    state: {}
  }).catch(err => logger.debug(`Error scheduling cases task with ID ${_constants.CASES_TELEMETRY_TASK_NAME} and type ${_constants.CASES_TELEMETRY_TASK_NAME}. Received ${err.message}`));
};
exports.scheduleCasesTelemetryTask = scheduleCasesTelemetryTask;