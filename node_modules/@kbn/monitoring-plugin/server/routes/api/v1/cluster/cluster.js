"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clusterRoute = clusterRoute;
var _cluster = require("../../../../../common/http_api/cluster");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_clusters_from_request = require("../../../../lib/cluster/get_clusters_from_request");
var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function clusterRoute(server) {
  /*
   * Cluster Overview
   */

  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_cluster.postClusterRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_cluster.postClusterRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    handler: async req => {
      const options = {
        clusterUuid: req.params.clusterUuid,
        start: req.payload.timeRange.min,
        end: req.payload.timeRange.max,
        codePaths: req.payload.codePaths
      };
      try {
        const clusters = await (0, _get_clusters_from_request.getClustersFromRequest)(req, options);
        return _cluster.postClusterResponsePayloadRT.encode(clusters);
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}