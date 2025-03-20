"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitialDetectionMetrics = void 0;
var _get_initial_usage = require("./ml_jobs/get_initial_usage");
var _get_initial_usage2 = require("./rules/get_initial_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Initial detection metrics initialized.
 */
const getInitialDetectionMetrics = () => ({
  ml_jobs: {
    ml_job_usage: (0, _get_initial_usage.getInitialMlJobUsage)(),
    ml_job_metrics: []
  },
  detection_rules: {
    detection_rule_detail: [],
    detection_rule_usage: (0, _get_initial_usage2.getInitialRulesUsage)(),
    detection_rule_status: (0, _get_initial_usage2.getInitialEventLogUsage)()
  }
});
exports.getInitialDetectionMetrics = getInitialDetectionMetrics;