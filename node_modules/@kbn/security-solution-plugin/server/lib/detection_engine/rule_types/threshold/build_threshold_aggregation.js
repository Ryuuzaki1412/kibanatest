"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildThresholdSingleBucketAggregation = exports.buildThresholdMultiBucketAggregation = void 0;
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildThresholdMultiBucketAggregation = ({
  threshold,
  aggregatableTimestampField,
  sortKeys
}) => {
  return {
    thresholdTerms: {
      composite: {
        sources: threshold.field.map((term, i) => ({
          [term]: {
            terms: {
              field: term
            }
          }
        })),
        after: sortKeys,
        size: 10000
      },
      aggs: {
        max_timestamp: {
          max: {
            field: aggregatableTimestampField
          }
        },
        min_timestamp: {
          min: {
            field: aggregatableTimestampField
          }
        },
        ...((0, _utils.shouldFilterByCardinality)(threshold) ? {
          cardinality_count: {
            cardinality: {
              field: threshold.cardinality[0].field
            }
          },
          cardinality_check: {
            bucket_selector: {
              buckets_path: {
                cardinalityCount: 'cardinality_count'
              },
              script: `params.cardinalityCount >= ${threshold.cardinality[0].value}` // TODO: user-selected cardinality operator?
            }
          }
        } : {}),
        count_check: {
          bucket_selector: {
            buckets_path: {
              docCount: '_count'
            },
            script: `params.docCount >= ${threshold.value}`
          }
        }
      }
    }
  };
};
exports.buildThresholdMultiBucketAggregation = buildThresholdMultiBucketAggregation;
const buildThresholdSingleBucketAggregation = ({
  threshold,
  aggregatableTimestampField
}) => ({
  max_timestamp: {
    max: {
      field: aggregatableTimestampField
    }
  },
  min_timestamp: {
    min: {
      field: aggregatableTimestampField
    }
  },
  ...((0, _utils.shouldFilterByCardinality)(threshold) ? {
    cardinality_count: {
      cardinality: {
        field: threshold.cardinality[0].field
      }
    }
  } : {})
});
exports.buildThresholdSingleBucketAggregation = buildThresholdSingleBucketAggregation;