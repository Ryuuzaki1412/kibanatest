"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1ClusterRoutes = registerV1ClusterRoutes;
var _cluster = require("./cluster");
var _clusters = require("./clusters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1ClusterRoutes(server) {
  (0, _cluster.clusterRoute)(server);
  (0, _clusters.clustersRoute)(server);
}