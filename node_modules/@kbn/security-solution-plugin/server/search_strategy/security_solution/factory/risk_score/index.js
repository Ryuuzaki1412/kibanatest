"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.riskScoreFactory = void 0;
var _search_strategy = require("../../../../../common/search_strategy");
var _all = require("./all");
var _kpi = require("./kpi");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const riskScoreFactory = {
  [_search_strategy.RiskQueries.hostsRiskScore]: _all.riskScore,
  [_search_strategy.RiskQueries.usersRiskScore]: _all.riskScore,
  [_search_strategy.RiskQueries.kpiRiskScore]: _kpi.kpiRiskScore
};
exports.riskScoreFactory = riskScoreFactory;