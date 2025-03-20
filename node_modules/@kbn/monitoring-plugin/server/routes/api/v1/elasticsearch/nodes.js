"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esNodesRoute = esNodesRoute;
var _elasticsearch = require("../../../../../common/http_api/elasticsearch");
var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");
var _get_cluster_status = require("../../../../lib/cluster/get_cluster_status");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _nodes = require("../../../../lib/elasticsearch/nodes");
var _get_paginated_nodes = require("../../../../lib/elasticsearch/nodes/get_nodes/get_paginated_nodes");
var _nodes_listing_metrics = require("../../../../lib/elasticsearch/nodes/get_nodes/nodes_listing_metrics");
var _get_indices_unassigned_shard_stats = require("../../../../lib/elasticsearch/shards/get_indices_unassigned_shard_stats");
var _get_nodes_shard_count = require("../../../../lib/elasticsearch/shards/get_nodes_shard_count");
var _handle_error = require("../../../../lib/errors/handle_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function esNodesRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchNodesRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchNodesRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/nodes',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const {
        pagination,
        sort: {
          field = '',
          direction = 'asc'
        } = {},
        queryText = ''
      } = req.payload;
      const clusterUuid = req.params.clusterUuid;
      try {
        const clusterStats = await (0, _get_cluster_stats.getClusterStats)(req, clusterUuid);
        const nodesShardCount = await (0, _get_nodes_shard_count.getNodesShardCount)(req, clusterStats);
        const indicesUnassignedShardStats = await (0, _get_indices_unassigned_shard_stats.getIndicesUnassignedShardStats)(req, clusterStats);
        const clusterStatus = (0, _get_cluster_status.getClusterStatus)(clusterStats, indicesUnassignedShardStats);
        const metricSet = _nodes_listing_metrics.LISTING_METRICS_NAMES;
        const {
          pageOfNodes,
          totalNodeCount
        } = await (0, _get_paginated_nodes.getPaginatedNodes)(req, {
          clusterUuid
        }, metricSet, pagination, {
          field,
          direction
        }, queryText, {
          clusterStats,
          nodesShardCount
        });
        const nodes = await (0, _nodes.getNodes)(req, pageOfNodes, clusterStats, nodesShardCount);
        return _elasticsearch.postElasticsearchNodesResponsePayloadRT.encode({
          clusterStatus,
          nodes,
          totalNodeCount
        });
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }
  });
}