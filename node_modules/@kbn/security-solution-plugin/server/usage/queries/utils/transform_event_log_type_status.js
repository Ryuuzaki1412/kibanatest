"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformEventLogTypeStatus = void 0;
var _get_initial_usage = require("../../detections/rules/get_initial_usage");
var _count_totals = require("./count_totals");
var _transform_single_rule_metric = require("./transform_single_rule_metric");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a raw Elasticsearch aggregation against the event log this will transform that
 * for telemetry. This expects the aggregation to be broken down by "ruleType" and "ruleStatus".
 * @param aggs The Elasticsearch aggregations broken down by "ruleType" and "ruleStatus"
 * @params logger The kibana logger
 * @returns The single metric from the aggregation broken down
 */
const transformEventLogTypeStatus = ({
  aggs,
  logger
}) => {
  // early return if the aggs are empty/null
  if (aggs == null) {
    logger.debug('Was expecting aggregations to exist for "transformEventLogTypeStatus", returning empty metrics instead');
    return (0, _get_initial_usage.getInitialSingleEventLogUsage)();
  }

  // metrics
  const eqlMetrics = aggs.eventActionExecutionMetrics['siem.eqlRule'];
  const indicatorMetrics = aggs.eventActionExecutionMetrics['siem.indicatorRule'];
  const mlMetrics = aggs.eventActionExecutionMetrics['siem.mlRule'];
  const queryMetrics = aggs.eventActionExecutionMetrics['siem.queryRule'];
  const savedQueryMetrics = aggs.eventActionExecutionMetrics['siem.savedQueryRule'];
  const thresholdMetrics = aggs.eventActionExecutionMetrics['siem.thresholdRule'];

  // failure status
  const eqlFailure = aggs.eventActionStatusChange.failed['siem.eqlRule'];
  const indicatorFailure = aggs.eventActionStatusChange.failed['siem.indicatorRule'];
  const mlFailure = aggs.eventActionStatusChange.failed['siem.mlRule'];
  const queryFailure = aggs.eventActionStatusChange.failed['siem.queryRule'];
  const savedQueryFailure = aggs.eventActionStatusChange.failed['siem.savedQueryRule'];
  const thresholdFailure = aggs.eventActionStatusChange.failed['siem.thresholdRule'];

  // partial failure
  const eqlPartialFailure = aggs.eventActionStatusChange['partial failure']['siem.eqlRule'];
  const indicatorPartialFailure = aggs.eventActionStatusChange['partial failure']['siem.indicatorRule'];
  const mlPartialFailure = aggs.eventActionStatusChange['partial failure']['siem.mlRule'];
  const queryPartialFailure = aggs.eventActionStatusChange['partial failure']['siem.queryRule'];
  const savedQueryPartialFailure = aggs.eventActionStatusChange['partial failure']['siem.savedQueryRule'];
  const thresholdPartialFailure = aggs.eventActionStatusChange['partial failure']['siem.thresholdRule'];

  // success
  const eqlSuccess = aggs.eventActionStatusChange.succeeded['siem.eqlRule'];
  const indicatorSuccess = aggs.eventActionStatusChange.succeeded['siem.indicatorRule'];
  const mlSuccess = aggs.eventActionStatusChange.succeeded['siem.mlRule'];
  const querySuccess = aggs.eventActionStatusChange.succeeded['siem.queryRule'];
  const savedQuerySuccess = aggs.eventActionStatusChange.succeeded['siem.savedQueryRule'];
  const thresholdSuccess = aggs.eventActionStatusChange.succeeded['siem.thresholdRule'];
  return {
    eql: (0, _transform_single_rule_metric.transformSingleRuleMetric)({
      failed: eqlFailure,
      partialFailed: eqlPartialFailure,
      succeeded: eqlSuccess,
      singleMetric: eqlMetrics
    }),
    threat_match: (0, _transform_single_rule_metric.transformSingleRuleMetric)({
      failed: indicatorFailure,
      partialFailed: indicatorPartialFailure,
      succeeded: indicatorSuccess,
      singleMetric: indicatorMetrics
    }),
    machine_learning: (0, _transform_single_rule_metric.transformSingleRuleMetric)({
      failed: mlFailure,
      partialFailed: mlPartialFailure,
      succeeded: mlSuccess,
      singleMetric: mlMetrics
    }),
    query: (0, _transform_single_rule_metric.transformSingleRuleMetric)({
      failed: queryFailure,
      partialFailed: queryPartialFailure,
      succeeded: querySuccess,
      singleMetric: queryMetrics
    }),
    saved_query: (0, _transform_single_rule_metric.transformSingleRuleMetric)({
      failed: savedQueryFailure,
      partialFailed: savedQueryPartialFailure,
      succeeded: savedQuerySuccess,
      singleMetric: savedQueryMetrics
    }),
    threshold: (0, _transform_single_rule_metric.transformSingleRuleMetric)({
      failed: thresholdFailure,
      partialFailed: thresholdPartialFailure,
      succeeded: thresholdSuccess,
      singleMetric: thresholdMetrics
    }),
    total: {
      failures: (0, _count_totals.countTotals)([eqlFailure, indicatorFailure, mlFailure, queryFailure, savedQueryFailure, thresholdFailure]),
      partial_failures: (0, _count_totals.countTotals)([eqlPartialFailure, indicatorPartialFailure, mlPartialFailure, queryPartialFailure, savedQueryPartialFailure, thresholdPartialFailure]),
      succeeded: (0, _count_totals.countTotals)([eqlSuccess, indicatorSuccess, mlSuccess, querySuccess, savedQuerySuccess, thresholdSuccess])
    }
  };
};
exports.transformEventLogTypeStatus = transformEventLogTypeStatus;