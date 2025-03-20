"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiagnosticsPreview = void 0;
var _preview_sender = require("../../../../telemetry/preview_sender");
var _diagnostic = require("../../../../telemetry/tasks/diagnostic");
var _parse_ndjson = require("./parse_ndjson");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getDiagnosticsPreview = async ({
  logger,
  telemetryReceiver,
  telemetrySender
}) => {
  const taskExecutionPeriod = {
    last: new Date(0).toISOString(),
    current: new Date().toISOString()
  };
  const taskSender = new _preview_sender.PreviewTelemetryEventsSender(logger, telemetrySender);
  const task = (0, _diagnostic.createTelemetryDiagnosticsTaskConfig)();
  await task.runTask('diagnostics-preview', logger, telemetryReceiver, taskSender, taskExecutionPeriod);
  const messages = taskSender.getSentMessages();
  return (0, _parse_ndjson.parseNdjson)(messages);
};
exports.getDiagnosticsPreview = getDiagnosticsPreview;