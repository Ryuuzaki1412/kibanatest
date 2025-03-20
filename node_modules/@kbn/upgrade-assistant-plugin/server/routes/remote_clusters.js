"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRemoteClustersRoute = registerRemoteClustersRoute;
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerRemoteClustersRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/remote_clusters`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client
        }
      } = await core;
      const clustersByName = await client.asCurrentUser.cluster.remoteInfo();
      const remoteClusters = Object.keys(clustersByName);
      return response.ok({
        body: remoteClusters
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}