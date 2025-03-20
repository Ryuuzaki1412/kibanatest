"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryFilterListArtifactTaskConfig = createTelemetryFilterListArtifactTaskConfig;
var _constants = require("../constants");
var _artifact = require("../artifact");
var _filterlists = require("../filterlists");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryFilterListArtifactTaskConfig() {
  return {
    type: 'security:telemetry-filterlist-artifact',
    title: 'Security Solution Telemetry Filter List Artifact Task',
    interval: '45m',
    timeout: '1m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      const startTime = Date.now();
      const taskName = 'Security Solution Telemetry Filter List Artifact Task';
      try {
        const artifactName = 'telemetry-filterlists-v1';
        const artifact = await _artifact.artifactService.getArtifact(artifactName);
        (0, _helpers.tlog)(logger, `New filterlist artifact: ${JSON.stringify(artifact)}`);
        _filterlists.filterList.endpointAlerts = artifact.endpoint_alerts;
        _filterlists.filterList.exceptionLists = artifact.exception_lists;
        _filterlists.filterList.prebuiltRulesAlerts = artifact.prebuilt_rules_alerts;
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
        return 0;
      } catch (err) {
        (0, _helpers.tlog)(logger, `Failed to set telemetry filterlist artifact due to ${err.message}`);
        _filterlists.filterList.resetAllToDefault();
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
        return 0;
      }
    }
  };
}