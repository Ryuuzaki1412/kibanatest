"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchPValues = void 0;
var _constants = require("../../../../common/correlations/constants");
var _latency_distribution_chart_types = require("../../../../common/latency_distribution_chart_types");
var _utils = require("../utils");
var _fetch_duration_histogram_range_steps = require("./fetch_duration_histogram_range_steps");
var _fetch_failed_events_correlation_p_values = require("./fetch_failed_events_correlation_p_values");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchPValues = async ({
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  query,
  durationMin,
  durationMax,
  fieldCandidates
}) => {
  const chartType = _latency_distribution_chart_types.LatencyDistributionChartType.failedTransactionsCorrelations;
  const searchMetrics = false; // failed transactions correlations does not search metrics documents
  const eventType = (0, _utils.getEventType)(chartType, searchMetrics);
  const {
    rangeSteps
  } = await (0, _fetch_duration_histogram_range_steps.fetchDurationHistogramRangeSteps)({
    apmEventClient,
    chartType,
    start,
    end,
    environment,
    kuery,
    query,
    searchMetrics,
    durationMinOverride: durationMin,
    durationMaxOverride: durationMax
  });
  const {
    fulfilled,
    rejected
  } = (0, _utils.splitAllSettledPromises)(await Promise.allSettled(fieldCandidates.map(fieldName => (0, _fetch_failed_events_correlation_p_values.fetchFailedEventsCorrelationPValues)({
    apmEventClient,
    start,
    end,
    environment,
    kuery,
    query,
    fieldName,
    rangeSteps
  }))));
  const flattenedResults = fulfilled.flat();
  const failedTransactionsCorrelations = [];
  let fallbackResult;
  flattenedResults.forEach(record => {
    if (record && typeof record.pValue === 'number' && record.pValue < _constants.ERROR_CORRELATION_THRESHOLD) {
      failedTransactionsCorrelations.push(record);
    } else {
      // If there's no result matching the criteria
      // Find the next highest/closest result to the threshold
      // to use as a fallback result
      if (!fallbackResult) {
        fallbackResult = record;
      } else {
        if (record.pValue !== null && fallbackResult && fallbackResult.pValue !== null && record.pValue < fallbackResult.pValue) {
          fallbackResult = record;
        }
      }
    }
  });
  const index = apmEventClient.indices[eventType];
  const ccsWarning = rejected.length > 0 && index.includes(':');
  return {
    failedTransactionsCorrelations,
    ccsWarning,
    fallbackResult
  };
};
exports.fetchPValues = fetchPValues;