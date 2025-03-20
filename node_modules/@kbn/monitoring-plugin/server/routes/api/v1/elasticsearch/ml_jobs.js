"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlJobRoute = mlJobRoute;
var _elasticsearch = require("../../../../../common/http_api/elasticsearch");
var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");
var _get_cluster_status = require("../../../../lib/cluster/get_cluster_status");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_ml_jobs = require("../../../../lib/elasticsearch/get_ml_jobs");
var _get_indices_unassigned_shard_stats = require("../../../../lib/elasticsearch/shards/get_indices_unassigned_shard_stats");
var _handle_error = require("../../../../lib/errors/handle_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function mlJobRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchMlJobsRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchMlJobsRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/ml_jobs',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const clusterUuid = req.params.clusterUuid;
      try {
        const clusterStats = await (0, _get_cluster_stats.getClusterStats)(req, clusterUuid);
        const indicesUnassignedShardStats = await (0, _get_indices_unassigned_shard_stats.getIndicesUnassignedShardStats)(req, clusterStats);
        const rows = await (0, _get_ml_jobs.getMlJobs)(req);
        return _elasticsearch.postElasticsearchMlJobsResponsePayloadRT.encode({
          clusterStatus: (0, _get_cluster_status.getClusterStatus)(clusterStats, indicesUnassignedShardStats),
          rows
        });
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }
  });
}