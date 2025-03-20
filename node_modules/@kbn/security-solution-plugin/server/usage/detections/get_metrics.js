"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDetectionsMetrics = void 0;
var _get_metrics = require("./ml_jobs/get_metrics");
var _get_metrics2 = require("./rules/get_metrics");
var _get_initial_usage = require("./rules/get_initial_usage");
var _get_initial_usage2 = require("./ml_jobs/get_initial_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getDetectionsMetrics = async ({
  eventLogIndex,
  signalsIndex,
  esClient,
  savedObjectsClient,
  logger,
  mlClient
}) => {
  const [mlJobMetrics, detectionRuleMetrics] = await Promise.allSettled([(0, _get_metrics.getMlJobMetrics)({
    mlClient,
    savedObjectsClient,
    logger
  }), (0, _get_metrics2.getRuleMetrics)({
    signalsIndex,
    eventLogIndex,
    esClient,
    savedObjectsClient,
    logger
  })]);
  return {
    ml_jobs: mlJobMetrics.status === 'fulfilled' ? mlJobMetrics.value : {
      ml_job_metrics: [],
      ml_job_usage: (0, _get_initial_usage2.getInitialMlJobUsage)()
    },
    detection_rules: detectionRuleMetrics.status === 'fulfilled' ? detectionRuleMetrics.value : {
      detection_rule_detail: [],
      detection_rule_usage: (0, _get_initial_usage.getInitialRulesUsage)(),
      detection_rule_status: (0, _get_initial_usage.getInitialEventLogUsage)()
    }
  };
};
exports.getDetectionsMetrics = getDetectionsMetrics;