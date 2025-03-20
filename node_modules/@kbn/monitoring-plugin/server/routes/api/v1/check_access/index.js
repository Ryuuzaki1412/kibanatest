"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1CheckAccessRoutes = registerV1CheckAccessRoutes;
var _check_access = require("./check_access");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1CheckAccessRoutes(server) {
  (0, _check_access.checkAccessRoute)(server);
}