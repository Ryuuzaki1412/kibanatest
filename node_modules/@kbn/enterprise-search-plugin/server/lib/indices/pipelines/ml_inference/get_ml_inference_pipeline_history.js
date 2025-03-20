"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMlInferencePipelineHistory = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchMlInferencePipelineHistory = async (client, index) => {
  var _ingestPipelineProces;
  const ingestPipelineProcessorsResult = await client.search({
    aggs: {
      inference_processors: {
        terms: {
          field: '_ingest.processors.pipeline.enum',
          size: 100
        }
      }
    },
    index,
    size: 0
  });
  const processorBuckets = (_ingestPipelineProces = ingestPipelineProcessorsResult.aggregations) === null || _ingestPipelineProces === void 0 ? void 0 : _ingestPipelineProces.inference_processors.buckets;
  if (!processorBuckets) {
    return {
      history: []
    };
  }
  const bucketsList = Array.isArray(processorBuckets) ? processorBuckets : Object.values(processorBuckets);
  return {
    history: bucketsList.map(bucket => ({
      doc_count: bucket.doc_count,
      pipeline: bucket.key
    }))
  };
};
exports.fetchMlInferencePipelineHistory = fetchMlInferencePipelineHistory;