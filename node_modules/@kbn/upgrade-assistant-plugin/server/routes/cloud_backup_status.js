"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCloudBackupStatusRoutes = registerCloudBackupStatusRoutes;
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerCloudBackupStatusRoutes({
  router,
  lib: {
    handleEsError
  }
}) {
  // GET most recent Cloud snapshot
  router.get({
    path: `${_constants.API_BASE_PATH}/cloud_backup_status`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async (context, request, response) => {
    const {
      client: clusterClient
    } = (await context.core).elasticsearch;
    try {
      const {
        snapshots
      } = await clusterClient.asCurrentUser.snapshot.get({
        repository: _constants.CLOUD_SNAPSHOT_REPOSITORY,
        snapshot: '_all',
        ignore_unavailable: true,
        // Allow request to succeed even if some snapshots are unavailable.
        order: 'desc',
        sort: 'start_time',
        size: 1
      });
      let isBackedUp = false;
      let lastBackupTime;
      if (snapshots && snapshots[0]) {
        isBackedUp = true;
        lastBackupTime = snapshots[0].start_time;
      }
      return response.ok({
        body: {
          isBackedUp,
          lastBackupTime
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}