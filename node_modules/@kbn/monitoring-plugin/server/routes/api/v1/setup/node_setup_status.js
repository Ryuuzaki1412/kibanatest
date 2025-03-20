"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeSetupStatusRoute = nodeSetupStatusRoute;
var _setup = require("../../../../../common/http_api/setup");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _verify_monitoring_auth = require("../../../../lib/elasticsearch/verify_monitoring_auth");
var _errors = require("../../../../lib/errors");
var _collection = require("../../../../lib/setup/collection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function nodeSetupStatusRoute(server) {
  /*
   * Monitoring Home
   * Route Init (for checking license and compatibility for multi-cluster monitoring
   */

  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_setup.postNodeSetupStatusRequestParamsRT);
  const validateQuery = (0, _create_route_validation_function.createValidationFunction)(_setup.postNodeSetupStatusRequestQueryRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_setup.postNodeSetupStatusRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/setup/collection/node/{nodeUuid}',
    validate: {
      params: validateParams,
      query: validateQuery,
      body: validateBody
    },
    handler: async req => {
      const nodeUuid = req.params.nodeUuid;
      const skipLiveData = req.query.skipLiveData;

      // NOTE using try/catch because checkMonitoringAuth is expected to throw
      // an error when current logged-in user doesn't have permission to read
      // the monitoring data. `try/catch` makes it a little more explicit.
      try {
        await (0, _verify_monitoring_auth.verifyMonitoringAuth)(req);
        const status = await (0, _collection.getCollectionStatus)(req, undefined, nodeUuid, skipLiveData);
        return _setup.postNodeSetupStatusResponsePayloadRT.encode(status);
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}