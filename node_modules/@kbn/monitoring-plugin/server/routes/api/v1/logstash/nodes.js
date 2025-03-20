"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashNodesRoute = logstashNodesRoute;
var _get_cluster_status = require("../../../../lib/logstash/get_cluster_status");
var _get_nodes = require("../../../../lib/logstash/get_nodes");
var _errors = require("../../../../lib/errors");
var _post_logstash_nodes = require("../../../../../common/http_api/logstash/post_logstash_nodes");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function logstashNodesRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_post_logstash_nodes.postLogstashNodesRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_post_logstash_nodes.postLogstashNodesRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/nodes',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const clusterUuid = req.params.clusterUuid;
      try {
        const [clusterStatus, nodes] = await Promise.all([(0, _get_cluster_status.getClusterStatus)(req, {
          clusterUuid
        }), (0, _get_nodes.getNodes)(req, {
          clusterUuid
        })]);
        return {
          clusterStatus,
          nodes
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}