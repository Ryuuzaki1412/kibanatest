"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esIndicesRoute = esIndicesRoute;
var _elasticsearch = require("../../../../../common/http_api/elasticsearch");
var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");
var _get_cluster_status = require("../../../../lib/cluster/get_cluster_status");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _indices = require("../../../../lib/elasticsearch/indices");
var _get_indices_unassigned_shard_stats = require("../../../../lib/elasticsearch/shards/get_indices_unassigned_shard_stats");
var _handle_error = require("../../../../lib/errors/handle_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function esIndicesRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchIndicesRequestParamsRT);
  const validateQuery = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchIndicesRequestQueryRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchIndicesRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/indices',
    validate: {
      params: validateParams,
      query: validateQuery,
      body: validateBody
    },
    async handler(req) {
      const {
        clusterUuid
      } = req.params;
      const {
        show_system_indices: showSystemIndices
      } = req.query;
      try {
        const clusterStats = await (0, _get_cluster_stats.getClusterStats)(req, clusterUuid);
        const indicesUnassignedShardStats = await (0, _get_indices_unassigned_shard_stats.getIndicesUnassignedShardStats)(req, clusterStats);
        const indices = await (0, _indices.getIndices)(req, showSystemIndices, indicesUnassignedShardStats);
        return _elasticsearch.postElasticsearchIndicesResponsePayloadRT.encode({
          clusterStatus: (0, _get_cluster_status.getClusterStatus)(clusterStats, indicesUnassignedShardStats),
          indices
        });
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }
  });
}