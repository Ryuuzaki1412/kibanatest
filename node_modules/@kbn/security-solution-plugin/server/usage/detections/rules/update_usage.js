"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRuleUsage = void 0;
var _update_query_usage = require("./usage_utils/update_query_usage");
var _update_total_usage = require("./usage_utils/update_total_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateRuleUsage = (detectionRuleMetric, usage) => {
  let updatedUsage = usage;
  if (detectionRuleMetric.rule_type === 'query') {
    updatedUsage = {
      ...usage,
      query: (0, _update_query_usage.updateQueryUsage)({
        ruleType: detectionRuleMetric.rule_type,
        usage,
        detectionRuleMetric
      })
    };
  } else if (detectionRuleMetric.rule_type === 'threshold') {
    updatedUsage = {
      ...usage,
      threshold: (0, _update_query_usage.updateQueryUsage)({
        ruleType: detectionRuleMetric.rule_type,
        usage,
        detectionRuleMetric
      })
    };
  } else if (detectionRuleMetric.rule_type === 'eql') {
    updatedUsage = {
      ...usage,
      eql: (0, _update_query_usage.updateQueryUsage)({
        ruleType: detectionRuleMetric.rule_type,
        usage,
        detectionRuleMetric
      })
    };
  } else if (detectionRuleMetric.rule_type === 'machine_learning') {
    updatedUsage = {
      ...usage,
      machine_learning: (0, _update_query_usage.updateQueryUsage)({
        ruleType: detectionRuleMetric.rule_type,
        usage,
        detectionRuleMetric
      })
    };
  } else if (detectionRuleMetric.rule_type === 'threat_match') {
    updatedUsage = {
      ...usage,
      threat_match: (0, _update_query_usage.updateQueryUsage)({
        ruleType: detectionRuleMetric.rule_type,
        usage,
        detectionRuleMetric
      })
    };
  } else if (detectionRuleMetric.rule_type === 'new_terms') {
    updatedUsage = {
      ...usage,
      new_terms: (0, _update_query_usage.updateQueryUsage)({
        ruleType: detectionRuleMetric.rule_type,
        usage,
        detectionRuleMetric
      })
    };
  }
  if (detectionRuleMetric.elastic_rule) {
    updatedUsage = {
      ...updatedUsage,
      elastic_total: (0, _update_total_usage.updateTotalUsage)({
        detectionRuleMetric,
        updatedUsage,
        totalType: 'elastic_total'
      })
    };
  } else {
    updatedUsage = {
      ...updatedUsage,
      custom_total: (0, _update_total_usage.updateTotalUsage)({
        detectionRuleMetric,
        updatedUsage,
        totalType: 'custom_total'
      })
    };
  }
  return updatedUsage;
};
exports.updateRuleUsage = updateRuleUsage;