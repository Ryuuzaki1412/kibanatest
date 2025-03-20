"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clustersRoute = clustersRoute;
var _cluster = require("../../../../../common/http_api/cluster");
var _get_clusters_from_request = require("../../../../lib/cluster/get_clusters_from_request");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _verify_monitoring_auth = require("../../../../lib/elasticsearch/verify_monitoring_auth");
var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function clustersRoute(server) {
  /*
   * Monitoring Home
   * Route Init (for checking license and compatibility for multi-cluster monitoring
   */

  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_cluster.postClustersRequestPayloadRT);

  // TODO switch from the LegacyServer route() method to the "new platform" route methods
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters',
    validate: {
      body: validateBody
    },
    handler: async req => {
      // NOTE using try/catch because checkMonitoringAuth is expected to throw
      // an error when current logged-in user doesn't have permission to read
      // the monitoring data. `try/catch` makes it a little more explicit.
      try {
        await (0, _verify_monitoring_auth.verifyMonitoringAuth)(req);
        const clusters = await (0, _get_clusters_from_request.getClustersFromRequest)(req, {
          codePaths: req.payload.codePaths
        });
        return _cluster.postClustersResponsePayloadRT.encode(clusters);
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}