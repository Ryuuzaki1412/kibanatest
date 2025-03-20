"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFieldValueFieldStats = void 0;
var _get_common_correlations_query = require("../get_common_correlations_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchFieldValueFieldStats = async ({
  apmEventClient,
  eventType,
  start,
  end,
  environment,
  kuery,
  query,
  field,
  samplerShardSize
}) => {
  var _aggregations$sample, _ref, _doc_count, _aggregations$sample2;
  const shouldSample = samplerShardSize !== undefined && samplerShardSize > 0;
  let aggs = {
    filtered_count: {
      filter: {
        term: {
          [`${field === null || field === void 0 ? void 0 : field.fieldName}`]: field === null || field === void 0 ? void 0 : field.fieldValue
        }
      }
    }
  };
  if (shouldSample) {
    aggs = {
      sample: {
        sampler: {
          shard_size: samplerShardSize
        },
        aggs: {
          filtered_count: {
            filter: {
              term: {
                [`${field === null || field === void 0 ? void 0 : field.fieldName}`]: field === null || field === void 0 ? void 0 : field.fieldValue
              }
            }
          }
        }
      }
    };
  }
  const {
    aggregations
  } = await apmEventClient.search('get_field_value_field_stats', {
    apm: {
      events: [eventType]
    },
    body: {
      size: 0,
      track_total_hits: false,
      query: (0, _get_common_correlations_query.getCommonCorrelationsQuery)({
        start,
        end,
        environment,
        kuery,
        query
      }),
      aggs
    }
  });
  const results = shouldSample ? aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sample = aggregations.sample) === null || _aggregations$sample === void 0 ? void 0 : _aggregations$sample.filtered_count : aggregations === null || aggregations === void 0 ? void 0 : aggregations.filtered_count;
  const topValues = [{
    key: field.fieldValue,
    doc_count: (_ref = results.doc_count) !== null && _ref !== void 0 ? _ref : 0
  }];
  const stats = {
    fieldName: field.fieldName,
    topValues,
    topValuesSampleSize: (_doc_count = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sample2 = aggregations.sample) === null || _aggregations$sample2 === void 0 ? void 0 : _aggregations$sample2.doc_count) !== null && _doc_count !== void 0 ? _doc_count : 0
  };
  return stats;
};
exports.fetchFieldValueFieldStats = fetchFieldValueFieldStats;