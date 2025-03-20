"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1AlertRoutes = registerV1AlertRoutes;
var _enable = require("./enable");
var _status = require("./status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1AlertRoutes(server, npRoute) {
  (0, _status.alertStatusRoute)(npRoute);
  (0, _enable.enableAlertsRoute)(server, npRoute);
}