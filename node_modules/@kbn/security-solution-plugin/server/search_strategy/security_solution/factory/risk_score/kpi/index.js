"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kpiRiskScore = void 0;
var _fp = require("lodash/fp");
var _build_query = require("../../../../../utils/build_query");
var _queryKpi_risk_score = require("./query.kpi_risk_score.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const kpiRiskScore = {
  buildDsl: options => (0, _queryKpi_risk_score.buildKpiRiskScoreQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryKpi_risk_score.buildKpiRiskScoreQuery)(options))]
    };
    const riskBuckets = (0, _fp.getOr)([], 'aggregations.risk.buckets', response.rawResponse);
    const result = riskBuckets.reduce((cummulative, bucket) => ({
      ...cummulative,
      [bucket.key]: (0, _fp.getOr)(0, 'unique_entries.value', bucket)
    }), {});
    return {
      ...response,
      kpiRiskScore: result,
      inspect
    };
  }
};
exports.kpiRiskScore = kpiRiskScore;