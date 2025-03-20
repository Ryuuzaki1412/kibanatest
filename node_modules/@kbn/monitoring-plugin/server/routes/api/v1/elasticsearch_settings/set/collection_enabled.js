"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCollectionEnabledRoute = setCollectionEnabledRoute;
var _elasticsearch_settings = require("../../../../../../common/http_api/elasticsearch_settings");
var _elasticsearch_settings2 = require("../../../../../lib/elasticsearch_settings");
var _errors = require("../../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Cluster Settings Check Route
 */
function setCollectionEnabledRoute(server) {
  server.route({
    method: 'put',
    path: '/api/monitoring/v1/elasticsearch_settings/set/collection_enabled',
    validate: {},
    async handler(req) {
      try {
        const response = await (0, _elasticsearch_settings2.setCollectionEnabled)(req);
        return _elasticsearch_settings.putElasticsearchSettingsCollectionEnabledResponsePayloadRT.encode(response);
      } catch (err) {
        throw (0, _errors.handleSettingsError)(err);
      }
    }
  });
}