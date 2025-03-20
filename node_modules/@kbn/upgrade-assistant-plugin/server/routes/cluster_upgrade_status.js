"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerClusterUpgradeStatusRoutes = registerClusterUpgradeStatusRoutes;
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerClusterUpgradeStatusRoutes({
  router
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/cluster_upgrade_status`,
    validate: false
  },
  // We're just depending on the version check to return a 426.
  // Otherwise we just return a 200.
  (0, _es_version_precheck.versionCheckHandlerWrapper)(async (context, request, response) => {
    return response.ok();
  }));
}