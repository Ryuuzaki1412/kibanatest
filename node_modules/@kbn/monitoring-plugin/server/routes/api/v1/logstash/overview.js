"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashOverviewRoute = logstashOverviewRoute;
var _post_logstash_overview = require("../../../../../common/http_api/logstash/post_logstash_overview");
var _get_cluster_status = require("../../../../lib/logstash/get_cluster_status");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _errors = require("../../../../lib/errors");
var _metric_set_overview = require("./metric_set_overview");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function logstashOverviewRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_post_logstash_overview.postLogstashOverviewRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_post_logstash_overview.postLogstashOverviewRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const clusterUuid = req.params.clusterUuid;
      try {
        const moduleType = 'logstash';
        const dsDataset = 'node_stats';
        const [metrics, clusterStatus] = await Promise.all([(0, _get_metrics.getMetrics)(req, moduleType, _metric_set_overview.metricSet, [{
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
        }]), (0, _get_cluster_status.getClusterStatus)(req, {
          clusterUuid
        })]);
        return {
          metrics,
          clusterStatus
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}