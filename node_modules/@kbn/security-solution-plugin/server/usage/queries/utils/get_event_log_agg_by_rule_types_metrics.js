"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventLogAggByRuleTypesMetrics = void 0;
var _get_event_log_agg_by_rule_type_metrics = require("./get_event_log_agg_by_rule_type_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getEventLogAggByRuleTypesMetrics = ruleTypes => {
  return ruleTypes.reduce((accum, ruleType) => {
    accum[ruleType] = (0, _get_event_log_agg_by_rule_type_metrics.getEventLogAggByRuleTypeMetrics)(ruleType);
    return accum;
  }, {});
};
exports.getEventLogAggByRuleTypesMetrics = getEventLogAggByRuleTypesMetrics;