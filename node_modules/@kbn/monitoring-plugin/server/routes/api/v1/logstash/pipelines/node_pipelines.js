"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashNodePipelinesRoute = logstashNodePipelinesRoute;
var _get_node_info = require("../../../../../lib/logstash/get_node_info");
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

const throughputMetric = 'logstash_node_pipeline_throughput';
const nodesCountMetric = 'logstash_node_pipeline_nodes_count';

// Mapping client and server metric keys together
const sortMetricSetMap = {
  latestThroughput: throughputMetric,
  latestNodesCount: nodesCountMetric
};
function logstashNodePipelinesRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashNodePipelinesRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashNodePipelinesRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/node/{logstashUuid}/pipelines',
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
      const {
        clusterUuid,
        logstashUuid
      } = req.params;
      try {
        var _sortMetricSetMap;
        const response = await (0, _get_paginated_pipelines.getPaginatedPipelines)({
          req,
          clusterUuid,
          logstashUuid,
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
          nodeSummary: await (0, _get_node_info.getNodeInfo)(req, {
            clusterUuid,
            logstashUuid
          })
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}