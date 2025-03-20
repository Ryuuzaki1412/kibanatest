"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esOverviewRoute = esOverviewRoute;
var _constants = require("../../../../../common/constants");
var _elasticsearch = require("../../../../../common/http_api/elasticsearch");
var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");
var _get_cluster_status = require("../../../../lib/cluster/get_cluster_status");
var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _get_last_recovery = require("../../../../lib/elasticsearch/get_last_recovery");
var _get_indices_unassigned_shard_stats = require("../../../../lib/elasticsearch/shards/get_indices_unassigned_shard_stats");
var _handle_error = require("../../../../lib/errors/handle_error");
var _logs = require("../../../../lib/logs");
var _metric_set_overview = require("./metric_set_overview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function esOverviewRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchOverviewRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchOverviewRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const logsIndexPattern = (0, _get_index_patterns.getIndexPatterns)({
        config,
        type: 'logs',
        moduleType: 'elasticsearch',
        ccs: _constants.CCS_REMOTE_PATTERN
      });
      const {
        min: start,
        max: end
      } = req.payload.timeRange;
      try {
        const [clusterStats, metrics, shardActivity, logs] = await Promise.all([(0, _get_cluster_stats.getClusterStats)(req, clusterUuid), (0, _get_metrics.getMetrics)(req, 'elasticsearch', _metric_set_overview.metricSet), (0, _get_last_recovery.getLastRecovery)(req, config.ui.max_bucket_size),
        // TODO this call is missing some items from the signature of `getLogs`, will need to resolve during TS conversion
        (0, _logs.getLogs)(config, req, logsIndexPattern, {
          clusterUuid,
          start,
          end
        })]);
        const indicesUnassignedShardStats = await (0, _get_indices_unassigned_shard_stats.getIndicesUnassignedShardStats)(req, clusterStats);
        const result = {
          clusterStatus: (0, _get_cluster_status.getClusterStatus)(clusterStats, indicesUnassignedShardStats),
          metrics,
          logs,
          shardActivity
        };
        return _elasticsearch.postElasticsearchOverviewResponsePayloadRT.encode(result);
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }
  });
}