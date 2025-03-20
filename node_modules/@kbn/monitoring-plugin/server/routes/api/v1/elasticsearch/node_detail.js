"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esNodeRoute = esNodeRoute;
var _lodash = require("lodash");
var _constants = require("../../../../../common/constants");
var _elasticsearch = require("../../../../../common/http_api/elasticsearch");
var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");
var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _nodes = require("../../../../lib/elasticsearch/nodes");
var _shards = require("../../../../lib/elasticsearch/shards");
var _handle_error = require("../../../../lib/errors/handle_error");
var _get_logs = require("../../../../lib/logs/get_logs");
var _metric_set_node_detail = require("./metric_set_node_detail");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  advanced: metricSetAdvanced,
  overview: metricSetOverview
} = _metric_set_node_detail.metricSets;
function esNodeRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchNodeDetailRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_elasticsearch.postElasticsearchNodeDetailRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/nodes/{nodeUuid}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      var _req$payload$showSyst;
      const config = server.config;
      const showSystemIndices = (_req$payload$showSyst = req.payload.showSystemIndices) !== null && _req$payload$showSyst !== void 0 ? _req$payload$showSyst : false;
      const clusterUuid = req.params.clusterUuid;
      const nodeUuid = req.params.nodeUuid;
      const start = req.payload.timeRange.min;
      const end = req.payload.timeRange.max;
      const logsIndexPattern = (0, _get_index_patterns.getIndexPatterns)({
        config,
        type: 'logs',
        moduleType: 'elasticsearch',
        ccs: _constants.CCS_REMOTE_PATTERN
      });
      const isAdvanced = req.payload.is_advanced;
      let metricSet;
      if (isAdvanced) {
        metricSet = metricSetAdvanced;
      } else {
        metricSet = metricSetOverview;
        // set the cgroup option if needed
        const showCgroupMetricsElasticsearch = config.ui.container.elasticsearch.enabled;
        const metricCpu = metricSet.find(m => typeof m === 'object' && m.name === 'node_cpu_metric');
        if (metricCpu) {
          if (showCgroupMetricsElasticsearch) {
            metricCpu.keys = ['node_cgroup_quota_as_cpu_utilization'];
          } else {
            metricCpu.keys = ['node_cpu_utilization'];
          }
        }
      }
      try {
        const cluster = await (0, _get_cluster_stats.getClusterStats)(req, clusterUuid);
        const clusterState = (0, _lodash.get)(cluster, 'cluster_state', (0, _lodash.get)(cluster, 'elasticsearch.cluster.stats.state'));
        const shardStats = await (0, _shards.getShardStats)(req, cluster, {
          includeIndices: true,
          includeNodes: true,
          nodeUuid
        });
        const nodeSummary = await (0, _nodes.getNodeSummary)(req, clusterState, shardStats, {
          clusterUuid,
          nodeUuid,
          start,
          end
        });
        const metrics = await (0, _get_metrics.getMetrics)(req, 'elasticsearch', metricSet, [{
          term: {
            'source_node.uuid': nodeUuid
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
                  'shard.node': nodeUuid
                }
              }, {
                term: {
                  'elasticsearch.node.name': nodeUuid
                }
              }]
            }
          };
          const stateUuid = (0, _lodash.get)(cluster, 'cluster_state.state_uuid', (0, _lodash.get)(cluster, 'elasticsearch.cluster.stats.state.state_uuid'));
          const allocationOptions = {
            shardFilter,
            stateUuid,
            showSystemIndices
          };
          const shards = await (0, _shards.getShardAllocation)(req, allocationOptions);
          shardAllocation = {
            shards,
            shardStats: {
              indices: shardStats.indices
            },
            nodes: shardStats.nodes,
            // for identifying nodes that shard relocates to
            stateUuid // for debugging/troubleshooting
          };

          logs = await (0, _get_logs.getLogs)(config, req, logsIndexPattern, {
            clusterUuid,
            nodeUuid,
            start,
            end
          });
        }
        return _elasticsearch.postElasticsearchNodeDetailResponsePayloadRT.encode({
          nodeSummary,
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