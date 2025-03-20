"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1ElasticsearchSettingsRoutes = registerV1ElasticsearchSettingsRoutes;
var _cluster = require("./check/cluster");
var _internal_monitoring = require("./check/internal_monitoring");
var _nodes = require("./check/nodes");
var _collection_enabled = require("./set/collection_enabled");
var _collection_interval = require("./set/collection_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1ElasticsearchSettingsRoutes(server, npRoute) {
  (0, _cluster.clusterSettingsCheckRoute)(server);
  (0, _internal_monitoring.internalMonitoringCheckRoute)(server, npRoute);
  (0, _nodes.nodesSettingsCheckRoute)(server);
  (0, _collection_enabled.setCollectionEnabledRoute)(server);
  (0, _collection_interval.setCollectionIntervalRoute)(server);
}