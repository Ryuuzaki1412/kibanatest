"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterRuleDataForClusters = getClusterRuleDataForClusters;
var _get_index_patterns = require("../../cluster/get_index_patterns");
var _static_globals = require("../../../static_globals");
var _create_query = require("../../create_query");
var _metrics = require("../../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getClusterRuleDataForClusters(req, clusters, ccs) {
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const moduleType = 'kibana';
  const type = 'kibana_cluster_rules';
  const dataset = 'cluster_rules';
  const indexPatterns = (0, _get_index_patterns.getIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    dataset,
    ccs
  });
  return Promise.all(clusters.map(async cluster => {
    var _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3, _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8, _response$aggregation9;
    const clusterUuid = (_cluster$elasticsearc = (_cluster$elasticsearc2 = cluster.elasticsearch) === null || _cluster$elasticsearc2 === void 0 ? void 0 : (_cluster$elasticsearc3 = _cluster$elasticsearc2.cluster) === null || _cluster$elasticsearc3 === void 0 ? void 0 : _cluster$elasticsearc3.id) !== null && _cluster$elasticsearc !== void 0 ? _cluster$elasticsearc : cluster.cluster_uuid;
    const metric = _metrics.KibanaClusterRuleMetric.getMetricFields();
    const params = {
      index: indexPatterns,
      size: 0,
      ignore_unavailable: true,
      body: {
        query: (0, _create_query.createQuery)({
          type,
          dsDataset: (0, _get_index_patterns.getKibanaDataset)(dataset),
          metricset: dataset,
          start,
          end,
          clusterUuid,
          metric
        }),
        aggs: {
          indices: {
            terms: {
              field: '_index',
              size: 1
            }
          },
          overdue_count: {
            max: {
              field: 'kibana.cluster_rules.overdue.count'
            }
          },
          overdue_delay_p50: {
            max: {
              field: 'kibana.cluster_rules.overdue.delay.p50'
            }
          },
          overdue_delay_p99: {
            max: {
              field: 'kibana.cluster_rules.overdue.delay.p99'
            }
          }
        }
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    const response = await callWithRequest(req, 'search', params);
    const indices = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.indices) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
    if (indices.length === 0) {
      // This means they are only using internal monitoring and rule monitoring data is not available
      return null;
    }
    return {
      overdue: {
        count: (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : (_response$aggregation5 = _response$aggregation4.overdue_count) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.value,
        delay: {
          p50: (_response$aggregation6 = response.aggregations) === null || _response$aggregation6 === void 0 ? void 0 : (_response$aggregation7 = _response$aggregation6.overdue_delay_p50) === null || _response$aggregation7 === void 0 ? void 0 : _response$aggregation7.value,
          p99: (_response$aggregation8 = response.aggregations) === null || _response$aggregation8 === void 0 ? void 0 : (_response$aggregation9 = _response$aggregation8.overdue_delay_p99) === null || _response$aggregation9 === void 0 ? void 0 : _response$aggregation9.value
        }
      },
      clusterUuid
    };
  }));
}