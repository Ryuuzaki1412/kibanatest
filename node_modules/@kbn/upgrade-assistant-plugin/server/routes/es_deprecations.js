"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerESDeprecationRoutes = registerESDeprecationRoutes;
var _constants = require("../../common/constants");
var _es_deprecations_status = require("../lib/es_deprecations_status");
var _es_version_precheck = require("../lib/es_version_precheck");
var _reindex_actions = require("../lib/reindexing/reindex_actions");
var _reindexing = require("../lib/reindexing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerESDeprecationRoutes({
  config: {
    featureSet
  },
  router,
  lib: {
    handleEsError
  },
  licensing,
  log
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/es_deprecations`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        savedObjects: {
          client: savedObjectsClient
        },
        elasticsearch: {
          client
        }
      } = await core;
      const status = await (0, _es_deprecations_status.getESUpgradeStatus)(client, featureSet);
      const asCurrentUser = client.asCurrentUser;
      const reindexActions = (0, _reindex_actions.reindexActionsFactory)(savedObjectsClient, asCurrentUser);
      const reindexService = (0, _reindexing.reindexServiceFactory)(asCurrentUser, reindexActions, log, licensing);
      const indexNames = status.deprecations.filter(({
        index
      }) => typeof index !== 'undefined').map(({
        index
      }) => index);
      await reindexService.cleanupReindexOperations(indexNames);
      return response.ok({
        body: status
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}