"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashPipelineRoute = logstashPipelineRoute;
var _boom = require("@hapi/boom");
var _errors = require("../../../../lib/errors");
var _post_logstash_pipeline = require("../../../../../common/http_api/logstash/post_logstash_pipeline");
var _get_pipeline_versions = require("../../../../lib/logstash/get_pipeline_versions");
var _get_pipeline = require("../../../../lib/logstash/get_pipeline");
var _get_pipeline_vertex = require("../../../../lib/logstash/get_pipeline_vertex");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getPipelineVersion(versions, pipelineHash) {
  var _versions$find;
  return pipelineHash ? (_versions$find = versions.find(({
    hash
  }) => hash === pipelineHash)) !== null && _versions$find !== void 0 ? _versions$find : versions[0] : versions[0];
}
function logstashPipelineRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_post_logstash_pipeline.postLogstashPipelineRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_post_logstash_pipeline.postLogstashPipelineRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/pipeline/{pipelineId}/{pipelineHash?}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      var _req$params$pipelineH;
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const detailVertexId = req.payload.detailVertexId;
      const pipelineId = req.params.pipelineId;
      // Optional params default to empty string, set to null to be more explicit.
      const pipelineHash = (_req$params$pipelineH = req.params.pipelineHash) !== null && _req$params$pipelineH !== void 0 ? _req$params$pipelineH : null;

      // Figure out which version of the pipeline we want to show
      let versions;
      try {
        versions = await (0, _get_pipeline_versions.getPipelineVersions)({
          req,
          clusterUuid,
          pipelineId
        });
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
      const version = getPipelineVersion(versions, pipelineHash);
      const callGetPipelineVertexFunc = () => {
        if (!detailVertexId) {
          return Promise.resolve(undefined);
        }
        return (0, _get_pipeline_vertex.getPipelineVertex)(req, config, clusterUuid, pipelineId, version, detailVertexId);
      };
      try {
        const [pipeline, vertex] = await Promise.all([(0, _get_pipeline.getPipeline)(req, config, clusterUuid, pipelineId, version), callGetPipelineVertexFunc()]);
        return {
          versions,
          pipeline,
          vertex
        };
      } catch (err) {
        if (err instanceof _errors.PipelineNotFoundError) {
          req.getLogger().error(err.message);
          throw (0, _boom.notFound)(err.message);
        }
        return (0, _errors.handleError)(err, req);
      }
    }
  });
}