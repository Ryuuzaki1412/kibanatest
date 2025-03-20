"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaInstancesRoute = kibanaInstancesRoute;
var _get_kibana_cluster_status = require("./_get_kibana_cluster_status");
var _get_kibanas = require("../../../../lib/kibana/get_kibanas");
var _errors = require("../../../../lib/errors");
var _kibana = require("../../../../../common/http_api/kibana");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function kibanaInstancesRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_kibana.postKibanaInstancesRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_kibana.postKibanaInstancesRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/kibana/instances',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const clusterUuid = req.params.clusterUuid;
      try {
        const [clusterStatus, kibanas] = await Promise.all([(0, _get_kibana_cluster_status.getKibanaClusterStatus)(req, {
          clusterUuid
        }), (0, _get_kibanas.getKibanas)(req, {
          clusterUuid
        })]);
        return _kibana.postKibanaInstancesResponsePayloadRT.encode({
          clusterStatus,
          kibanas
        });
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}