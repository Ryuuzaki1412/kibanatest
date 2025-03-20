"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFieldValuePairs = void 0;
var _constants = require("../../../../common/correlations/constants");
var _utils = require("../utils");
var _get_common_correlations_query = require("./get_common_correlations_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchFieldValuePairs = async ({
  apmEventClient,
  fieldCandidates,
  eventType,
  start,
  end,
  environment,
  kuery,
  query
}) => {
  const {
    fulfilled: responses,
    rejected: errors
  } = (0, _utils.splitAllSettledPromises)(await Promise.allSettled(fieldCandidates.map(async fieldName => {
    var _response$aggregation, _response$aggregation2;
    const response = await apmEventClient.search('get_field_value_pairs_for_field_candidate', {
      apm: {
        events: [eventType]
      },
      body: {
        track_total_hits: false,
        size: 0,
        query: (0, _get_common_correlations_query.getCommonCorrelationsQuery)({
          start,
          end,
          environment,
          kuery,
          query
        }),
        aggs: {
          attribute_terms: {
            terms: {
              field: fieldName,
              size: _constants.TERMS_SIZE
            }
          }
        }
      }
    });
    return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.attribute_terms.buckets.map(d => {
      var _d$key_as_string;
      return {
        fieldName,
        // The terms aggregation returns boolean fields as { key: 0, key_as_string: "false" },
        // so we need to pick `key_as_string` if it's present, otherwise searches on boolean fields would fail later on.
        fieldValue: (_d$key_as_string = d.key_as_string) !== null && _d$key_as_string !== void 0 ? _d$key_as_string : d.key
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  })));
  return {
    fieldValuePairs: responses.flat(),
    errors
  };
};
exports.fetchFieldValuePairs = fetchFieldValuePairs;