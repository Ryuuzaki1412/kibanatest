"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineBulkGetUserProfilesRoute = defineBulkGetUserProfilesRoute;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../errors");
var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineBulkGetUserProfilesRoute({
  router,
  getUserProfileService
}) {
  router.post({
    path: '/internal/security/user_profile/_bulk_get',
    validate: {
      body: _configSchema.schema.object({
        uids: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
          minSize: 1
        }),
        dataPath: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      tags: ['access:bulkGetUserProfiles']
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    const userProfileServiceInternal = getUserProfileService();
    try {
      const profiles = await userProfileServiceInternal.bulkGet({
        uids: new Set(request.body.uids),
        dataPath: request.body.dataPath
      });
      return response.ok({
        body: profiles
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}