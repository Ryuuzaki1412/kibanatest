"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internalMonitoringCheckRoute = internalMonitoringCheckRoute;
var _ccs_utils = require("../../../../../../common/ccs_utils");
var _constants = require("../../../../../../common/constants");
var _elasticsearch_settings = require("../../../../../../common/http_api/elasticsearch_settings");
var _create_route_validation_function = require("../../../../../lib/create_route_validation_function");
var _errors = require("../../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const queryBody = {
  size: 0,
  query: {
    bool: {
      must: [{
        range: {
          timestamp: {
            gte: 'now-12h'
          }
        }
      }]
    }
  },
  aggs: {
    types: {
      terms: {
        field: '_index',
        size: 10
      }
    }
  }
};
const checkLatestMonitoringIsLegacy = async (context, index) => {
  const client = (await context.core).elasticsearch.client.asCurrentUser;
  const result = await client.search({
    index,
    body: queryBody
  });
  const {
    aggregations
  } = result;
  const counts = {
    legacyIndicesCount: 0,
    mbIndicesCount: 0
  };
  if (!aggregations) {
    return counts;
  }
  const {
    types: {
      buckets
    }
  } = aggregations;
  counts.mbIndicesCount = buckets.filter(({
    key
  }) => key.includes('-mb-')).length;
  counts.legacyIndicesCount = buckets.length - counts.mbIndicesCount;
  return counts;
};
function internalMonitoringCheckRoute(server, npRoute) {
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch_settings.postElasticsearchSettingsInternalMonitoringRequestPayloadRT);
  npRoute.router.post({
    path: '/api/monitoring/v1/elasticsearch_settings/check/internal_monitoring',
    validate: {
      body: validateBody
    }
  }, async (context, request, response) => {
    try {
      const typeCount = {
        legacy_indices: 0,
        mb_indices: 0
      };
      const config = server.config;
      const {
        ccs
      } = request.body;
      const esIndexPattern = (0, _ccs_utils.prefixIndexPatternWithCcs)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);
      const kbnIndexPattern = (0, _ccs_utils.prefixIndexPatternWithCcs)(config, _constants.INDEX_PATTERN_KIBANA, ccs);
      const lsIndexPattern = (0, _ccs_utils.prefixIndexPatternWithCcs)(config, _constants.INDEX_PATTERN_LOGSTASH, ccs);
      const indexCounts = await Promise.all([checkLatestMonitoringIsLegacy(context, esIndexPattern), checkLatestMonitoringIsLegacy(context, kbnIndexPattern), checkLatestMonitoringIsLegacy(context, lsIndexPattern)]);
      indexCounts.forEach(counts => {
        typeCount.legacy_indices += counts.legacyIndicesCount;
        typeCount.mb_indices += counts.mbIndicesCount;
      });
      return response.ok(_elasticsearch_settings.postElasticsearchSettingsInternalMonitoringResponsePayloadRT.encode({
        body: typeCount
      }));
    } catch (err) {
      throw (0, _errors.handleError)(err);
    }
  });
}