"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqueEndpointCount = exports.getEndpointMetrics = void 0;
var _constants = require("../../../common/constants");
var _helpers = require("../../lib/telemetry/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getEndpointMetrics = async ({
  esClient,
  logger
}) => {
  return {
    unique_endpoint_count: await getUniqueEndpointCount(esClient, logger)
  };
};
exports.getEndpointMetrics = getEndpointMetrics;
const getUniqueEndpointCount = async (esClient, logger) => {
  try {
    var _endpointCountRespons, _endpointCountRespons2;
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: _constants.ENDPOINT_METRICS_INDEX,
      ignore_unavailable: false,
      body: {
        size: 0,
        // no query results required - only aggregation quantity
        query: {
          range: {
            '@timestamp': {
              gte: 'now-24h',
              lt: 'now'
            }
          }
        },
        aggs: {
          endpoint_count: {
            cardinality: {
              field: 'agent.id'
            }
          }
        }
      }
    };
    const response = await esClient.search(query);
    const {
      aggregations: endpointCountResponse
    } = response;
    return (_endpointCountRespons = endpointCountResponse === null || endpointCountResponse === void 0 ? void 0 : (_endpointCountRespons2 = endpointCountResponse.endpoint_count) === null || _endpointCountRespons2 === void 0 ? void 0 : _endpointCountRespons2.value) !== null && _endpointCountRespons !== void 0 ? _endpointCountRespons : 0;
  } catch (e) {
    (0, _helpers.tlog)(logger, `Failed to get active endpoint count due to: ${e.message}`);
    return 0;
  }
};
exports.getUniqueEndpointCount = getUniqueEndpointCount;