"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetCurrentUserProfileRoute = defineGetCurrentUserProfileRoute;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../errors");
var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineGetCurrentUserProfileRoute({
  router,
  getUserProfileService,
  getAuthenticationService
}) {
  router.get({
    path: '/internal/security/user_profile',
    validate: {
      query: _configSchema.schema.object({
        dataPath: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    const authenticationService = await getAuthenticationService();
    const currentUser = authenticationService.getCurrentUser(request);
    if (!currentUser) {
      return response.notFound();
    }
    let profile;
    try {
      profile = await getUserProfileService().getCurrent({
        request,
        dataPath: request.query.dataPath
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
    if (!profile) {
      return response.notFound();
    }
    const body = {
      ...profile,
      user: {
        ...profile.user,
        authentication_provider: currentUser.authentication_provider
      }
    };
    return response.ok({
      body
    });
  }));
}