"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashNodeRoute = logstashNodeRoute;
var _logstash = require("../../../../../common/http_api/logstash");
var _get_node_info = require("../../../../lib/logstash/get_node_info");
var _errors = require("../../../../lib/errors");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _metric_set_node = require("./metric_set_node");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  advanced: metricSetAdvanced,
  overview: metricSetOverview
} = _metric_set_node.metricSets;
function logstashNodeRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashNodeRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashNodeRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/node/{logstashUuid}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const logstashUuid = req.params.logstashUuid;
      let metricSet;
      if (req.payload.is_advanced) {
        metricSet = metricSetAdvanced;
      } else {
        metricSet = metricSetOverview;
        // set the cgroup option if needed
        const showCgroupMetricsLogstash = config.ui.container.logstash.enabled;
        const metricCpu = metricSet.find(m => (0, _get_metrics.isNamedMetricDescriptor)(m) && m.name === 'logstash_node_cpu_metric');
        if (metricCpu) {
          if (showCgroupMetricsLogstash) {
            metricCpu.keys = ['logstash_node_cgroup_quota_as_cpu_utilization'];
          } else {
            metricCpu.keys = ['logstash_node_cpu_utilization'];
          }
        }
      }
      try {
        const dsDataset = 'node_stats';
        const [metrics, nodeSummary] = await Promise.all([(0, _get_metrics.getMetrics)(req, 'logstash', metricSet, [{
          bool: {
            should: [{
              term: {
                'data_stream.dataset': (0, _get_index_patterns.getLogstashDataset)(dsDataset)
              }
            }, {
              term: {
                'metricset.name': dsDataset
              }
            }, {
              term: {
                type: 'logstash_stats'
              }
            }]
          }
        }]), (0, _get_node_info.getNodeInfo)(req, {
          clusterUuid,
          logstashUuid
        })]);
        return {
          metrics,
          nodeSummary
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}