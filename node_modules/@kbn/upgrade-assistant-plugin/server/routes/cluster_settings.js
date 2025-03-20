"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerClusterSettingsRoute = registerClusterSettingsRoute;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerClusterSettingsRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: `${_constants.API_BASE_PATH}/cluster_settings`,
    validate: {
      body: _configSchema.schema.object({
        settings: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client
        }
      } = await core;
      const {
        settings
      } = request.body;

      // We need to fetch the current cluster settings in order to determine
      // if the settings to delete were set as transient or persistent settings
      const currentClusterSettings = await client.asCurrentUser.cluster.getSettings({
        flat_settings: true
      });
      const settingsToDelete = settings.reduce((settingsBody, currentSetting) => {
        if (Object.keys(currentClusterSettings.persistent).find(key => key === currentSetting)) {
          settingsBody.persistent[currentSetting] = null;
        }
        if (Object.keys(currentClusterSettings.transient).find(key => key === currentSetting)) {
          settingsBody.transient[currentSetting] = null;
        }
        return settingsBody;
      }, {
        persistent: {},
        transient: {}
      });
      const settingsResponse = await client.asCurrentUser.cluster.putSettings({
        body: settingsToDelete,
        flat_settings: true
      });
      return response.ok({
        body: settingsResponse
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}