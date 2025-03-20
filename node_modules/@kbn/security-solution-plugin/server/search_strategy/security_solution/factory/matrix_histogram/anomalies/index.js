"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anomaliesMatrixHistogramConfig = void 0;
var _search_strategy = require("../../../../../../common/search_strategy");
var _queryAnomalies_histogram = require("./query.anomalies_histogram.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const anomaliesMatrixHistogramConfig = {
  buildDsl: _queryAnomalies_histogram.buildAnomaliesHistogramQuery,
  aggName: _search_strategy.MatrixHistogramTypeToAggName.anomalies,
  parseKey: 'anomalies.buckets'
};
exports.anomaliesMatrixHistogramConfig = anomaliesMatrixHistogramConfig;