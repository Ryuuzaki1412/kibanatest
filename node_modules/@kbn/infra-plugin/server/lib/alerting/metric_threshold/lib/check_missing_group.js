"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkMissingGroups = void 0;
var _lodash = require("lodash");
var _metric_query = require("./metric_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const checkMissingGroups = async (esClient, metricParams, indexPattern, groupBy, filterQuery, logger, timeframe, missingGroups = []) => {
  if (missingGroups.length === 0) {
    return missingGroups;
  }
  const currentTimeframe = (0, _metric_query.calculateCurrentTimeframe)(metricParams, timeframe);
  const baseFilters = (0, _metric_query.createBaseFilters)(metricParams, currentTimeframe, filterQuery);
  const groupByFields = (0, _lodash.isString)(groupBy) ? [groupBy] : groupBy ? groupBy : [];
  const searches = missingGroups.flatMap(group => {
    const groupByFilters = Object.values(group.bucketKey).map((key, index) => {
      return {
        match: {
          [groupByFields[index]]: key
        }
      };
    });
    return [{
      index: indexPattern
    }, {
      size: 0,
      terminate_after: 1,
      track_total_hits: true,
      query: {
        bool: {
          filter: [...baseFilters, ...groupByFilters]
        }
      }
    }];
  });
  logger.trace(`Request: ${JSON.stringify({
    searches
  })}`);
  const response = await esClient.msearch({
    searches
  });
  logger.trace(`Response: ${JSON.stringify(response)}`);
  const verifiedMissingGroups = response.responses.map((resp, index) => {
    const total = (0, _lodash.get)(resp, 'hits.total.value', 0);
    if (!total) {
      return missingGroups[index];
    }
    return null;
  }).filter(_lodash.identity);
  return verifiedMissingGroups;
};
exports.checkMissingGroups = checkMissingGroups;