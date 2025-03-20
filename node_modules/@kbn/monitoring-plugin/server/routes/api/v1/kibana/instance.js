"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaInstanceRoute = kibanaInstanceRoute;
var _get_kibana_info = require("../../../../lib/kibana/get_kibana_info");
var _errors = require("../../../../lib/errors");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _metric_set_instance = require("./metric_set_instance");
var _kibana = require("../../../../../common/http_api/kibana");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function kibanaInstanceRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_kibana.postKibanaInstanceRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_kibana.postKibanaInstanceRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/kibana/{kibanaUuid}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const clusterUuid = req.params.clusterUuid;
      const kibanaUuid = req.params.kibanaUuid;
      try {
        const [metrics, kibanaSummary] = await Promise.all([(0, _get_metrics.getMetrics)(req, 'kibana', _metric_set_instance.metricSet), (0, _get_kibana_info.getKibanaInfo)(req, {
          clusterUuid,
          kibanaUuid
        })]);
        return _kibana.postKibanaInstanceResponsePayloadRT.encode({
          metrics,
          kibanaSummary
        });
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}