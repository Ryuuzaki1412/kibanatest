"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1LogstashRoutes = registerV1LogstashRoutes;
var _node = require("./node");
var _nodes = require("./nodes");
var _overview = require("./overview");
var _pipeline = require("./pipeline");
var _cluster_pipelines = require("./pipelines/cluster_pipelines");
var _cluster_pipeline_ids = require("./pipelines/cluster_pipeline_ids");
var _node_pipelines = require("./pipelines/node_pipelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1LogstashRoutes(server) {
  (0, _cluster_pipeline_ids.logstashClusterPipelineIdsRoute)(server);
  (0, _cluster_pipelines.logstashClusterPipelinesRoute)(server);
  (0, _node_pipelines.logstashNodePipelinesRoute)(server);
  (0, _node.logstashNodeRoute)(server);
  (0, _nodes.logstashNodesRoute)(server);
  (0, _overview.logstashOverviewRoute)(server);
  (0, _pipeline.logstashPipelineRoute)(server);
}