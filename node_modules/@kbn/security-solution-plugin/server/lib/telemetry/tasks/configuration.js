"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryConfigurationTaskConfig = createTelemetryConfigurationTaskConfig;
var _constants = require("../constants");
var _artifact = require("../artifact");
var _configuration = require("../configuration");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryConfigurationTaskConfig() {
  return {
    type: 'security:telemetry-configuration',
    title: 'Security Solution Telemetry Configuration Task',
    interval: '1h',
    timeout: '1m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      const startTime = Date.now();
      const taskName = 'Security Solution Telemetry Configuration Task';
      try {
        const artifactName = 'telemetry-buffer-and-batch-sizes-v1';
        const configArtifact = await _artifact.artifactService.getArtifact(artifactName);
        (0, _helpers.tlog)(logger, `New telemetry configuration artifact: ${JSON.stringify(configArtifact)}`);
        _configuration.telemetryConfiguration.max_detection_alerts_batch = configArtifact.max_detection_alerts_batch;
        _configuration.telemetryConfiguration.telemetry_max_buffer_size = configArtifact.telemetry_max_buffer_size;
        _configuration.telemetryConfiguration.max_detection_rule_telemetry_batch = configArtifact.max_detection_rule_telemetry_batch;
        _configuration.telemetryConfiguration.max_endpoint_telemetry_batch = configArtifact.max_endpoint_telemetry_batch;
        _configuration.telemetryConfiguration.max_security_list_telemetry_batch = configArtifact.max_security_list_telemetry_batch;
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
        return 0;
      } catch (err) {
        (0, _helpers.tlog)(logger, `Failed to set telemetry configuration due to ${err.message}`);
        _configuration.telemetryConfiguration.resetAllToDefault();
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
        return 0;
      }
    }
  };
}