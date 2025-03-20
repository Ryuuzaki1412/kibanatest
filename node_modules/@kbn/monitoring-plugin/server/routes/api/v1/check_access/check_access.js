"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NO_REMOTE_CLIENT_ROLE_ERROR = void 0;
exports.checkAccessRoute = checkAccessRoute;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _verify_monitoring_auth = require("../../../../lib/elasticsearch/verify_monitoring_auth");
var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * API for checking read privilege on Monitoring Data
 * Used for the "Access Denied" page as something to auto-retry with.
 */

// TODO: Replace this legacy route registration with the "new platform" core Kibana route method
function checkAccessRoute(server) {
  server.route({
    method: 'get',
    path: '/api/monitoring/v1/check_access',
    validate: {},
    handler: async req => {
      const response = {};
      try {
        await (0, _verify_monitoring_auth.verifyMonitoringAuth)(req);
        if (server.config.ui.ccs.enabled) {
          await verifyClusterHasRemoteClusterClientRole(req);
        }
        response.has_access = true; // response data is ignored
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
      return response;
    }
  });
}
const NO_REMOTE_CLIENT_ROLE_ERROR = 'Cluster has no remote_cluster_client role';
exports.NO_REMOTE_CLIENT_ROLE_ERROR = NO_REMOTE_CLIENT_ROLE_ERROR;
async function verifyClusterHasRemoteClusterClientRole(req) {
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'transport.request', {
    method: 'GET',
    path: '/_nodes'
  });
  for (const node of Object.values(response.nodes)) {
    if (node.roles.includes('remote_cluster_client')) {
      return;
    }
  }
  throw _boom.default.forbidden(NO_REMOTE_CLIENT_ROLE_ERROR);
}