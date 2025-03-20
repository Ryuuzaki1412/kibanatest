"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.siblingPipelineAggWriter = void 0;
var _ = require("../../../..");
var _metric_agg_types = require("../metric_agg_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const siblingPipelineAggWriter = (agg, output) => {
  const metricAgg = agg.getParam('customMetric');
  const bucketAgg = agg.getParam('customBucket');
  if (!metricAgg) return;

  // if a bucket is selected, we must add this agg as a sibling to it, and add a metric to that bucket (or select one of its)
  if (metricAgg.type.name !== _metric_agg_types.METRIC_TYPES.COUNT) {
    bucketAgg.subAggs = (output.subAggs || []).concat(metricAgg);
    output.params.buckets_path = `${bucketAgg.id}>${metricAgg.id}`;

    // If the metric is another nested sibling pipeline agg, we need to include it as a sub-agg of this agg's bucket agg
    if (metricAgg.type.subtype === _.siblingPipelineType) {
      const subAgg = metricAgg.getParam('customBucket');
      if (subAgg) bucketAgg.subAggs.push(subAgg);
    }
  } else {
    output.params.buckets_path = bucketAgg.id + '>_count';
  }
  output.parentAggs = (output.parentAggs || []).concat(bucketAgg);
};
exports.siblingPipelineAggWriter = siblingPipelineAggWriter;