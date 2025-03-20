"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashClusterPipelinesRoute = logstashClusterPipelinesRoute;
var _get_cluster_status = require("../../../../../lib/logstash/get_cluster_status");
var _errors = require("../../../../../lib/errors");
var _get_paginated_pipelines = require("../../../../../lib/logstash/get_paginated_pipelines");
var _create_route_validation_function = require("../../../../../lib/create_route_validation_function");
var _logstash = require("../../../../../../common/http_api/logstash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const throughputMetric = 'logstash_cluster_pipeline_throughput';
const nodesCountMetric = 'logstash_cluster_pipeline_nodes_count';

// Mapping client and server metric keys together
const sortMetricSetMap = {
  latestThroughput: throughputMetric,
  latestNodesCount: nodesCountMetric
};
function logstashClusterPipelinesRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashClusterPipelinesRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashClusterPipelinesRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/pipelines',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const {
        pagination,
        sort: {
          field = '',
          direction = 'desc'
        } = {},
        queryText = ''
      } = req.payload;
      const clusterUuid = req.params.clusterUuid;
      try {
        var _sortMetricSetMap;
        const response = await (0, _get_paginated_pipelines.getPaginatedPipelines)({
          req,
          clusterUuid,
          metrics: {
            throughputMetric,
            nodesCountMetric
          },
          pagination,
          sort: {
            field: (_sortMetricSetMap = sortMetricSetMap[field]) !== null && _sortMetricSetMap !== void 0 ? _sortMetricSetMap : field,
            direction
          },
          queryText
        });
        return {
          ...response,
          clusterStatus: await (0, _get_cluster_status.getClusterStatus)(req, {
            clusterUuid
          })
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}