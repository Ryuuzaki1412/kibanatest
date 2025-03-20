"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeTaskSafe = removeTaskSafe;
exports.scheduleTaskSafe = scheduleTaskSafe;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function scheduleTaskSafe(taskManager, taskConfig, logger) {
  try {
    await taskManager.ensureScheduled(taskConfig);
    logger.info(`Scheduled task successfully [Task: ${taskConfig.id}]`);
  } catch (errMsg) {
    const error = (0, _securitysolutionEsUtils.transformError)(errMsg);
    logger.error(`Error scheduling task, received ${error.message}`);
    return false;
  }
  return true;
}
async function removeTaskSafe(taskManager, taskId, logger) {
  try {
    await taskManager.remove(taskId);
    logger.info(`Deleted task successfully [Task: ${taskId}]`);
  } catch (errMsg) {
    logger.error(`Failed to remove task: ${taskId}`);
    return false;
  }
  return true;
}