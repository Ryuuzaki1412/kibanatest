"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esIndexRoute = esIndexRoute;
var _lodash = require("lodash");
var _constants = require("../../../../../common/constants");
var _elasticsearch = require("../../../../../common/http_api/elasticsearch");
var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");
var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _indices = require("../../../../lib/elasticsearch/indices");
var _shards = require("../../../../lib/elasticsearch/shards");
var _handle_error = require("../../../../lib/errors/handle_error");
var _get_logs = require("../../../../lib/logs/get_logs");
var _metric_set_index_detail = require("./metric_set_index_detail");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  advanced: metricSetAdvanced,
  overview: metricSetOverview
} = _metric_set_index_detail.metricSets;
function esIndexRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchIndexDetailRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchIndexDetailRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/indices/{id}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    handler: async req => {
      try {
        const config = server.config;
        const clusterUuid = req.params.clusterUuid;
        const indexUuid = req.params.id;
        const start = req.payload.timeRange.min;
        const end = req.payload.timeRange.max;
        const logsIndexPattern = (0, _get_index_patterns.getIndexPatterns)({
          config,
          type: 'logs',
          moduleType: 'elasticsearch',
          ccs: _constants.CCS_REMOTE_PATTERN
        });
        const isAdvanced = req.payload.is_advanced;
        const metricSet = isAdvanced ? metricSetAdvanced : metricSetOverview;
        const cluster = await (0, _get_cluster_stats.getClusterStats)(req, clusterUuid);
        const showSystemIndices = true; // hardcode to true, because this could be a system index

        const shardStats = await (0, _shards.getShardStats)(req, cluster, {
          includeNodes: true,
          includeIndices: true,
          indexName: indexUuid
        });
        const indexSummary = await (0, _indices.getIndexSummary)(req, shardStats, {
          clusterUuid,
          indexUuid,
          start,
          end
        });
        const metrics = await (0, _get_metrics.getMetrics)(req, 'elasticsearch', metricSet, [{
          term: {
            'index_stats.index': indexUuid
          }
        }]);
        let logs;
        let shardAllocation;
        if (!isAdvanced) {
          // TODO: Why so many fields needed for a single component (shard legend)?
          const shardFilter = {
            bool: {
              should: [{
                term: {
                  'shard.index': indexUuid
                }
              }, {
                term: {
                  'elasticsearch.index.name': indexUuid
                }
              }]
            }
          };
          const stateUuid = (0, _lodash.get)(cluster, 'elasticsearch.cluster.stats.state.state_uuid', (0, _lodash.get)(cluster, 'cluster_state.state_uuid'));
          const allocationOptions = {
            shardFilter,
            stateUuid,
            showSystemIndices
          };
          const shards = await (0, _shards.getShardAllocation)(req, allocationOptions);
          logs = await (0, _get_logs.getLogs)(config, req, logsIndexPattern, {
            clusterUuid,
            indexUuid,
            start,
            end
          });
          shardAllocation = {
            shards,
            shardStats: {
              nodes: shardStats.nodes
            },
            nodes: shardStats.nodes,
            // for identifying nodes that shard relocates to
            stateUuid // for debugging/troubleshooting
          };
        }

        return _elasticsearch.postElasticsearchIndexDetailResponsePayloadRT.encode({
          indexSummary,
          metrics,
          logs,
          ...shardAllocation
        });
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }
  });
}