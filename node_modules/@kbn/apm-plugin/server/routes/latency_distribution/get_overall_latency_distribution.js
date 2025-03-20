"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOverallLatencyDistribution = getOverallLatencyDistribution;
var _with_apm_span = require("../../utils/with_apm_span");
var _fetch_duration_ranges = require("../correlations/queries/fetch_duration_ranges");
var _fetch_duration_histogram_range_steps = require("../correlations/queries/fetch_duration_histogram_range_steps");
var _get_percentile_threshold_value = require("./get_percentile_threshold_value");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getOverallLatencyDistribution({
  chartType,
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  query,
  percentileThreshold,
  durationMinOverride,
  durationMaxOverride,
  searchMetrics
}) {
  return (0, _with_apm_span.withApmSpan)('get_overall_latency_distribution', async () => {
    const overallLatencyDistribution = {};

    // #1: get 95th percentile to be displayed as a marker in the log log chart
    overallLatencyDistribution.percentileThresholdValue = await (0, _get_percentile_threshold_value.getPercentileThresholdValue)({
      chartType,
      apmEventClient,
      start,
      end,
      environment,
      kuery,
      query,
      percentileThreshold,
      searchMetrics
    });

    // finish early if we weren't able to identify the percentileThresholdValue.
    if (!overallLatencyDistribution.percentileThresholdValue) {
      return overallLatencyDistribution;
    }

    // #2: get histogram range steps
    const {
      durationMin,
      durationMax,
      rangeSteps
    } = await (0, _fetch_duration_histogram_range_steps.fetchDurationHistogramRangeSteps)({
      chartType,
      apmEventClient,
      start,
      end,
      environment,
      kuery,
      query,
      searchMetrics,
      durationMinOverride,
      durationMaxOverride
    });
    if (!rangeSteps) {
      return overallLatencyDistribution;
    }

    // #3: get histogram chart data
    const {
      totalDocCount,
      durationRanges
    } = await (0, _fetch_duration_ranges.fetchDurationRanges)({
      chartType,
      apmEventClient,
      start,
      end,
      environment,
      kuery,
      query,
      rangeSteps,
      searchMetrics
    });
    overallLatencyDistribution.durationMin = durationMin;
    overallLatencyDistribution.durationMax = durationMax;
    overallLatencyDistribution.totalDocCount = totalDocCount;
    overallLatencyDistribution.overallHistogram = durationRanges;
    return overallLatencyDistribution;
  });
}