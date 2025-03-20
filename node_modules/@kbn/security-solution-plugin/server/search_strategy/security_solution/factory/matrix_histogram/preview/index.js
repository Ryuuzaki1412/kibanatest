"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewMatrixHistogramConfig = void 0;
var _search_strategy = require("../../../../../../common/search_strategy");
var _queryPreview_histogram = require("./query.preview_histogram.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const previewMatrixHistogramConfig = {
  buildDsl: _queryPreview_histogram.buildPreviewHistogramQuery,
  aggName: _search_strategy.MatrixHistogramTypeToAggName.preview,
  parseKey: 'preview.buckets'
};
exports.previewMatrixHistogramConfig = previewMatrixHistogramConfig;