"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1SetupRoutes = registerV1SetupRoutes;
var _cluster_setup_status = require("./cluster_setup_status");
var _disable_elasticsearch_internal_collection = require("./disable_elasticsearch_internal_collection");
var _node_setup_status = require("./node_setup_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1SetupRoutes(server) {
  (0, _cluster_setup_status.clusterSetupStatusRoute)(server);
  (0, _disable_elasticsearch_internal_collection.disableElasticsearchInternalCollectionRoute)(server);
  (0, _node_setup_status.nodeSetupStatusRoute)(server);
}