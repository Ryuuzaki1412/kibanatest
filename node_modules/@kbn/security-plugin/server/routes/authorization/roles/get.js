"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetRolesRoutes = defineGetRolesRoutes;
var _configSchema = require("@kbn/config-schema");
var _authorization = require("../../../authorization");
var _errors = require("../../../errors");
var _licensed_route_handler = require("../../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineGetRolesRoutes({
  router,
  authz,
  getFeatures,
  logger
}) {
  router.get({
    path: '/api/security/role/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string({
          minLength: 1
        })
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const esClient = (await context.core).elasticsearch.client;
      const [features, elasticsearchRoles] = await Promise.all([getFeatures(), await esClient.asCurrentUser.security.getRole({
        name: request.params.name
      })]);
      const elasticsearchRole = elasticsearchRoles[request.params.name];
      if (elasticsearchRole) {
        return response.ok({
          body: (0, _authorization.transformElasticsearchRoleToRole)(features,
          // @ts-expect-error `SecurityIndicesPrivileges.names` expected to be `string[]`
          elasticsearchRole, request.params.name, authz.applicationName, logger)
        });
      }
      return response.notFound();
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}