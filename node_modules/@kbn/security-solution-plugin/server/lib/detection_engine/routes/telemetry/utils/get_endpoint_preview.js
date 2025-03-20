"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEndpointPreview = void 0;
var _preview_sender = require("../../../../telemetry/preview_sender");
var _endpoint = require("../../../../telemetry/tasks/endpoint");
var _parse_ndjson = require("./parse_ndjson");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getEndpointPreview = async ({
  logger,
  telemetryReceiver,
  telemetrySender
}) => {
  const taskExecutionPeriod = {
    last: new Date(0).toISOString(),
    current: new Date().toISOString()
  };
  const taskSender = new _preview_sender.PreviewTelemetryEventsSender(logger, telemetrySender);
  const task = (0, _endpoint.createTelemetryEndpointTaskConfig)(1000);
  await task.runTask('endpoint-preview', logger, telemetryReceiver, taskSender, taskExecutionPeriod);
  const messages = taskSender.getSentMessages();
  return (0, _parse_ndjson.parseNdjson)(messages);
};
exports.getEndpointPreview = getEndpointPreview;