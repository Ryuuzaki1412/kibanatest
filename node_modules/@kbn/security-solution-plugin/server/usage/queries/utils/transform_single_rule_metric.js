"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformSingleRuleMetric = void 0;
var _transform_categories = require("./transform_categories");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a different count cardinalities this will return them broken down by various
 * metrics such as "failed", "partial failed", "succeeded, and will list a top 10 of each
 * of the error message types.
 * @param failed The failed counts and top 10 "messages"
 * @param partialFailed The partial failed counts and top 10 "messages"
 * @param succeeded The succeeded counts
 * @param singleMetric The max/min/avg metric
 * @returns The single metric from the aggregation broken down
 */
const transformSingleRuleMetric = ({
  failed,
  partialFailed,
  succeeded,
  singleMetric
}) => {
  var _failed$cardinality$v, _partialFailed$cardin, _succeeded$cardinalit, _singleMetric$maxTota, _singleMetric$avgTota, _singleMetric$minTota, _singleMetric$maxTota2, _singleMetric$avgTota2, _singleMetric$minTota2, _singleMetric$maxTota3, _singleMetric$maxTota4, _singleMetric$avgTota3, _singleMetric$avgTota4, _singleMetric$minTota3, _singleMetric$minTota4, _singleMetric$maxGapD, _singleMetric$avgGapD, _singleMetric$minGapD, _singleMetric$gapCoun;
  return {
    failures: (_failed$cardinality$v = failed.cardinality.value) !== null && _failed$cardinality$v !== void 0 ? _failed$cardinality$v : 0,
    top_failures: (0, _transform_categories.transformCategories)(failed.categories),
    partial_failures: (_partialFailed$cardin = partialFailed.cardinality.value) !== null && _partialFailed$cardin !== void 0 ? _partialFailed$cardin : 0,
    top_partial_failures: (0, _transform_categories.transformCategories)(partialFailed.categories),
    succeeded: (_succeeded$cardinalit = succeeded.cardinality.value) !== null && _succeeded$cardinalit !== void 0 ? _succeeded$cardinalit : 0,
    index_duration: {
      max: (_singleMetric$maxTota = singleMetric.maxTotalIndexDuration.value) !== null && _singleMetric$maxTota !== void 0 ? _singleMetric$maxTota : 0.0,
      avg: (_singleMetric$avgTota = singleMetric.avgTotalIndexDuration.value) !== null && _singleMetric$avgTota !== void 0 ? _singleMetric$avgTota : 0.0,
      min: (_singleMetric$minTota = singleMetric.minTotalIndexDuration.value) !== null && _singleMetric$minTota !== void 0 ? _singleMetric$minTota : 0.0
    },
    search_duration: {
      max: (_singleMetric$maxTota2 = singleMetric.maxTotalSearchDuration.value) !== null && _singleMetric$maxTota2 !== void 0 ? _singleMetric$maxTota2 : 0.0,
      avg: (_singleMetric$avgTota2 = singleMetric.avgTotalSearchDuration.value) !== null && _singleMetric$avgTota2 !== void 0 ? _singleMetric$avgTota2 : 0.0,
      min: (_singleMetric$minTota2 = singleMetric.minTotalSearchDuration.value) !== null && _singleMetric$minTota2 !== void 0 ? _singleMetric$minTota2 : 0.0
    },
    enrichment_duration: {
      max: (_singleMetric$maxTota3 = singleMetric === null || singleMetric === void 0 ? void 0 : (_singleMetric$maxTota4 = singleMetric.maxTotalEnrichmentDuration) === null || _singleMetric$maxTota4 === void 0 ? void 0 : _singleMetric$maxTota4.value) !== null && _singleMetric$maxTota3 !== void 0 ? _singleMetric$maxTota3 : 0.0,
      avg: (_singleMetric$avgTota3 = singleMetric === null || singleMetric === void 0 ? void 0 : (_singleMetric$avgTota4 = singleMetric.avgTotalEnrichmentDuration) === null || _singleMetric$avgTota4 === void 0 ? void 0 : _singleMetric$avgTota4.value) !== null && _singleMetric$avgTota3 !== void 0 ? _singleMetric$avgTota3 : 0.0,
      min: (_singleMetric$minTota3 = singleMetric === null || singleMetric === void 0 ? void 0 : (_singleMetric$minTota4 = singleMetric.minTotalEnrichmentDuration) === null || _singleMetric$minTota4 === void 0 ? void 0 : _singleMetric$minTota4.value) !== null && _singleMetric$minTota3 !== void 0 ? _singleMetric$minTota3 : 0.0
    },
    gap_duration: {
      max: (_singleMetric$maxGapD = singleMetric.maxGapDuration.value) !== null && _singleMetric$maxGapD !== void 0 ? _singleMetric$maxGapD : 0.0,
      avg: (_singleMetric$avgGapD = singleMetric.avgGapDuration.value) !== null && _singleMetric$avgGapD !== void 0 ? _singleMetric$avgGapD : 0.0,
      min: (_singleMetric$minGapD = singleMetric.minGapDuration.value) !== null && _singleMetric$minGapD !== void 0 ? _singleMetric$minGapD : 0.0
    },
    gap_count: (_singleMetric$gapCoun = singleMetric.gapCount.value) !== null && _singleMetric$gapCoun !== void 0 ? _singleMetric$gapCoun : 0.0
  };
};
exports.transformSingleRuleMetric = transformSingleRuleMetric;