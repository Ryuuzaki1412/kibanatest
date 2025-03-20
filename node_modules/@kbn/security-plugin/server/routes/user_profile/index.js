"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineUserProfileRoutes = defineUserProfileRoutes;
var _bulk_get = require("./bulk_get");
var _get_current = require("./get_current");
var _update = require("./update");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineUserProfileRoutes(params) {
  (0, _update.defineUpdateUserProfileDataRoute)(params);
  (0, _get_current.defineGetCurrentUserProfileRoute)(params);
  (0, _bulk_get.defineBulkGetUserProfilesRoute)(params);
}