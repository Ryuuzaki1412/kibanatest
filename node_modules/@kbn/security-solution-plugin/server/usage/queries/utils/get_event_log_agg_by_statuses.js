"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventLogAggByStatuses = void 0;
var _get_event_log_agg_by_rule_types_metrics = require("./get_event_log_agg_by_rule_types_metrics");
var _get_event_log_agg_by_status = require("./get_event_log_agg_by_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given an array of rule types such as "siem.eqlRule" | "siem.mlRule", etc.. and
 * a rule status such as "succeeded" | "partial failure" | "failed", this will return
 * aggregations for querying and categorizing them.
 * @param ruleType The rule type such as "siem.eqlRule" | "siem.mlRule" etc...
 * @param ruleStatus The rule status such as "succeeded" | "partial failure" | "failed"
 * @returns The aggregation by rule status
 */
const getEventLogAggByStatuses = ({
  ruleStatuses,
  ruleTypes
}) => {
  const eventActionStatusChangeAggs = ruleStatuses.reduce((accum, ruleStatus) => {
    accum[ruleStatus] = (0, _get_event_log_agg_by_status.getEventLogAggByStatus)({
      ruleStatus,
      ruleTypes
    });
    return accum;
  }, {});
  const actionExecutionAggs = (0, _get_event_log_agg_by_rule_types_metrics.getEventLogAggByRuleTypesMetrics)(ruleTypes);
  return {
    eventActionStatusChange: {
      filter: {
        term: {
          'event.action': 'status-change'
        }
      },
      aggs: eventActionStatusChangeAggs
    },
    eventActionExecutionMetrics: {
      filter: {
        term: {
          'event.action': 'execution-metrics'
        }
      },
      aggs: actionExecutionAggs
    }
  };
};
exports.getEventLogAggByStatuses = getEventLogAggByStatuses;