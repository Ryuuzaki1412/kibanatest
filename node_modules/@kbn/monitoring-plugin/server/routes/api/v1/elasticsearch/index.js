"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1ElasticsearchRoutes = registerV1ElasticsearchRoutes;
var _ccr = require("./ccr");
var _ccr_shard = require("./ccr_shard");
var _index_detail = require("./index_detail");
var _indices = require("./indices");
var _ml_jobs = require("./ml_jobs");
var _nodes = require("./nodes");
var _node_detail = require("./node_detail");
var _overview = require("./overview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1ElasticsearchRoutes(server) {
  (0, _index_detail.esIndexRoute)(server);
  (0, _indices.esIndicesRoute)(server);
  (0, _node_detail.esNodeRoute)(server);
  (0, _nodes.esNodesRoute)(server);
  (0, _overview.esOverviewRoute)(server);
  (0, _ml_jobs.mlJobRoute)(server);
  (0, _ccr.ccrRoute)(server);
  (0, _ccr_shard.ccrShardRoute)(server);
}