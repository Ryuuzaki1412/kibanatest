"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAnonymousAccessRoutes = defineAnonymousAccessRoutes;
var _get_capabilities = require("./get_capabilities");
var _get_state = require("./get_state");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineAnonymousAccessRoutes(params) {
  (0, _get_capabilities.defineAnonymousAccessGetCapabilitiesRoutes)(params);
  (0, _get_state.defineAnonymousAccessGetStateRoutes)(params);
}