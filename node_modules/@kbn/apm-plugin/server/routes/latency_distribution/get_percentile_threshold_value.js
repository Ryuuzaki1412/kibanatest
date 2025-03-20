"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPercentileThresholdValue = getPercentileThresholdValue;
var _fetch_duration_percentiles = require("../correlations/queries/fetch_duration_percentiles");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getPercentileThresholdValue({
  apmEventClient,
  chartType,
  start,
  end,
  environment,
  kuery,
  query,
  percentileThreshold,
  searchMetrics
}) {
  const durationPercentiles = await (0, _fetch_duration_percentiles.fetchDurationPercentiles)({
    apmEventClient,
    chartType,
    start,
    end,
    environment,
    kuery,
    query,
    searchMetrics
  });
  return durationPercentiles.percentiles[`${percentileThreshold}.0`];
}