"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireUIRoutes = requireUIRoutes;
var _debug_logger = require("../debug_logger");
var _v = require("./api/v1");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function requireUIRoutes(server, config, npRoute) {
  const decoratedServer = config.ui.debug_mode ? (0, _debug_logger.decorateDebugServer)(server, config, npRoute.logger) : server;
  (0, _v.registerV1AlertRoutes)(decoratedServer, npRoute);
  (0, _v.registerV1ApmRoutes)(decoratedServer);
  (0, _v.registerV1BeatsRoutes)(decoratedServer);
  (0, _v.registerV1CheckAccessRoutes)(decoratedServer);
  (0, _v.registerV1ClusterRoutes)(decoratedServer);
  (0, _v.registerV1ElasticsearchRoutes)(decoratedServer);
  (0, _v.registerV1ElasticsearchSettingsRoutes)(decoratedServer, npRoute);
  (0, _v.registerV1EnterpriseSearchRoutes)(decoratedServer);
  (0, _v.registerV1HealthRoute)(decoratedServer);
  (0, _v.registerV1LogstashRoutes)(decoratedServer);
  (0, _v.registerV1SetupRoutes)(decoratedServer);
  (0, _v.registerV1KibanaRoutes)(decoratedServer);
}