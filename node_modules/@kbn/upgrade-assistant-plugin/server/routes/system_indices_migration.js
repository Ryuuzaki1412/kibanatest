"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSystemIndicesMigrationRoutes = registerSystemIndicesMigrationRoutes;
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
var _es_system_indices_migration = require("../lib/es_system_indices_migration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerSystemIndicesMigrationRoutes({
  router,
  lib: {
    handleEsError
  }
}) {
  // GET status of the system indices migration
  router.get({
    path: `${_constants.API_BASE_PATH}/system_indices_migration`,
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
      const status = await (0, _es_system_indices_migration.getESSystemIndicesMigrationStatus)(client.asCurrentUser);
      return response.ok({
        body: {
          ...status,
          features: status.features.filter(feature => feature.migration_status !== 'NO_MIGRATION_NEEDED')
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));

  // POST starts the system indices migration
  router.post({
    path: `${_constants.API_BASE_PATH}/system_indices_migration`,
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
      const status = await (0, _es_system_indices_migration.startESSystemIndicesMigration)(client.asCurrentUser);
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