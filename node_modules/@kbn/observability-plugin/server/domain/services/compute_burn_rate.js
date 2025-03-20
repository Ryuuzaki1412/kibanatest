"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeBurnRate = computeBurnRate;
var _number = require("../../utils/number");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A Burn Rate is computed with the Indicator Data retrieved from a specific lookback period
 * It tells how fast we are consumming our error budget during a specific period
 */
function computeBurnRate(slo, sliData) {
  const {
    good,
    total
  } = sliData;
  if (total === 0 || good >= total) {
    return 0;
  }
  const errorBudget = 1 - slo.objective.target;
  const errorRate = 1 - good / total;
  return (0, _number.toHighPrecision)(errorRate / errorBudget);
}