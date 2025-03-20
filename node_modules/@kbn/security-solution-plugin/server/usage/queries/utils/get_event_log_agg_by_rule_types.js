"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventLogAggByRuleTypes = void 0;
var _get_event_log_agg_by_rule_type = require("./get_event_log_agg_by_rule_type");
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
 * @returns The aggregation by rule types
 */
const getEventLogAggByRuleTypes = ({
  ruleTypes,
  ruleStatus
}) => {
  return ruleTypes.reduce((accum, ruleType) => {
    accum[ruleType] = (0, _get_event_log_agg_by_rule_type.getEventLogAggByRuleType)({
      ruleType,
      ruleStatus
    });
    return accum;
  }, {});
};
exports.getEventLogAggByRuleTypes = getEventLogAggByRuleTypes;