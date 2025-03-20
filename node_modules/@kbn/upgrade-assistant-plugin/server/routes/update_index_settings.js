"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateSettingsRoute = registerUpdateSettingsRoute;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerUpdateSettingsRoute({
  router
}) {
  router.post({
    path: `${_constants.API_BASE_PATH}/{indexName}/index_settings`,
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      }),
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
        indexName
      } = request.params;
      const {
        settings
      } = request.body;
      const settingsToDelete = settings.reduce((settingsBody, currentSetting) => {
        settingsBody[currentSetting] = null;
        return settingsBody;
      }, {});
      const settingsResponse = await client.asCurrentUser.indices.putSettings({
        index: indexName,
        body: settingsToDelete
      });
      return response.ok({
        body: settingsResponse
      });
    } catch (e) {
      const status = e.status || e.statusCode;
      if (status === 403) {
        return response.forbidden({
          body: e
        });
      }
      throw e;
    }
  }));
}