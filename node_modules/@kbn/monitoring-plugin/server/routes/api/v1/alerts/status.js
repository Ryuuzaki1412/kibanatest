"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertStatusRoute = alertStatusRoute;
var _configSchema = require("@kbn/config-schema");
var _fetch_status = require("../../../../lib/alerts/fetch_status");
var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function alertStatusRoute(npRoute) {
  npRoute.router.post({
    path: '/api/monitoring/v1/alert/{clusterUuid}/status',
    validate: {
      params: _configSchema.schema.object({
        clusterUuid: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        alertTypeIds: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.any())),
        timeRange: _configSchema.schema.object({
          min: _configSchema.schema.number(),
          max: _configSchema.schema.number()
        })
      })
    }
  }, async (context, request, response) => {
    try {
      var _await$context$alerti;
      const {
        clusterUuid
      } = request.params;
      const {
        alertTypeIds,
        filters
      } = request.body;
      const rulesClient = (_await$context$alerti = await context.alerting) === null || _await$context$alerti === void 0 ? void 0 : _await$context$alerti.getRulesClient();
      if (!rulesClient) {
        return response.ok({
          body: undefined
        });
      }
      const status = await (0, _fetch_status.fetchStatus)(rulesClient, alertTypeIds, [clusterUuid], filters);
      return response.ok({
        body: status
      });
    } catch (err) {
      throw (0, _errors.handleError)(err);
    }
  });
}