"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlInferenceErrors = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Fetches an aggregate of distinct ML inference errors from the target index, along with the most
 * recent error's timestamp and affected document count for each bucket.
 * @param indexName the index to get the errors from.
 * @param esClient the Elasticsearch Client to use to fetch the errors.
 */
const getMlInferenceErrors = async (indexName, esClient) => {
  var _searchResult$aggrega;
  const searchResult = await esClient.search({
    index: indexName,
    body: {
      aggs: {
        errors: {
          terms: {
            field: '_ingest.inference_errors.message.enum',
            order: {
              max_error_timestamp: 'desc'
            },
            size: 20
          },
          aggs: {
            max_error_timestamp: {
              max: {
                field: '_ingest.inference_errors.timestamp'
              }
            }
          }
        }
      },
      size: 0
    }
  });
  const errorBuckets = (_searchResult$aggrega = searchResult.aggregations) === null || _searchResult$aggrega === void 0 ? void 0 : _searchResult$aggrega.errors.buckets;
  if (!errorBuckets) {
    return [];
  }

  // Buckets are either in an array or in a Record, we transform them to an array
  const buckets = Array.isArray(errorBuckets) ? errorBuckets : Object.values(errorBuckets);
  return buckets.map(bucket => {
    var _bucket$max_error_tim;
    return {
      message: bucket.key,
      doc_count: bucket.doc_count,
      timestamp: (_bucket$max_error_tim = bucket.max_error_timestamp) === null || _bucket$max_error_tim === void 0 ? void 0 : _bucket$max_error_tim.value_as_string
    };
  });
};
exports.getMlInferenceErrors = getMlInferenceErrors;