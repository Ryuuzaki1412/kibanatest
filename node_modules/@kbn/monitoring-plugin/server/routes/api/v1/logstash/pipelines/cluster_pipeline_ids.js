"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashClusterPipelineIdsRoute = logstashClusterPipelineIdsRoute;
var _errors = require("../../../../../lib/errors");
var _get_pipeline_ids = require("../../../../../lib/logstash/get_pipeline_ids");
var _create_route_validation_function = require("../../../../../lib/create_route_validation_function");
var _logstash = require("../../../../../../common/http_api/logstash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function logstashClusterPipelineIdsRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashPipelineClusterIdsRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_logstash.postLogstashPipelineClusterIdsRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/pipeline_ids',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const size = config.ui.max_bucket_size;
      try {
        return await (0, _get_pipeline_ids.getLogstashPipelineIds)({
          req,
          clusterUuid,
          size
        });
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}