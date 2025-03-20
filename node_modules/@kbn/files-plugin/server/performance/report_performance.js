"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withReportPerformanceMetric = withReportPerformanceMetric;
var _ebtTools = require("@kbn/ebt-tools");
var _plugin = require("../plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function withReportPerformanceMetric(perfArgs, cb) {
  const analytics = _plugin.FilesPlugin.getAnalytics();
  const start = performance.now();
  const response = await cb();
  const end = performance.now();
  if (analytics) {
    (0, _ebtTools.reportPerformanceMetricEvent)(analytics, {
      ...perfArgs.eventData,
      duration: end - start
    });
  }
  return response;
}