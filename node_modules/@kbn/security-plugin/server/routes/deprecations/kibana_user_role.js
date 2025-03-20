"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineKibanaUserRoleDeprecationRoutes = defineKibanaUserRoleDeprecationRoutes;
var _deprecations = require("../../deprecations");
var _errors = require("../../errors");
var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required to handle `kibana_user` deprecation.
 */
function defineKibanaUserRoleDeprecationRoutes({
  router,
  logger
}) {
  router.post({
    path: '/internal/security/deprecations/kibana_user_role/_fix_users',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    let users;
    const esClient = (await context.core).elasticsearch.client;
    try {
      users = await esClient.asCurrentUser.security.getUser();
    } catch (err) {
      if ((0, _errors.getErrorStatusCode)(err) === 403) {
        logger.warn(`Failed to retrieve users when checking for deprecations: the manage_security cluster privilege is required`);
      } else {
        logger.error(`Failed to retrieve users when checking for deprecations, unexpected error: ${(0, _errors.getDetailedErrorMessage)(err)}`);
      }
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(err));
    }
    const usersWithKibanaUserRole = Object.values(users).filter(user => user.roles.includes(_deprecations.KIBANA_USER_ROLE_NAME));
    if (usersWithKibanaUserRole.length === 0) {
      logger.debug(`No users with "${_deprecations.KIBANA_USER_ROLE_NAME}" role found.`);
    } else {
      logger.debug(`The following users with "${_deprecations.KIBANA_USER_ROLE_NAME}" role found and will be migrated to "${_deprecations.KIBANA_ADMIN_ROLE_NAME}" role: ${usersWithKibanaUserRole.map(user => user.username).join(', ')}.`);
    }
    for (const userToUpdate of usersWithKibanaUserRole) {
      const roles = userToUpdate.roles.filter(role => role !== _deprecations.KIBANA_USER_ROLE_NAME);
      if (!roles.includes(_deprecations.KIBANA_ADMIN_ROLE_NAME)) {
        roles.push(_deprecations.KIBANA_ADMIN_ROLE_NAME);
      }
      try {
        await esClient.asCurrentUser.security.putUser({
          username: userToUpdate.username,
          body: {
            ...userToUpdate,
            roles
          }
        });
      } catch (err) {
        logger.error(`Failed to update user "${userToUpdate.username}": ${(0, _errors.getDetailedErrorMessage)(err)}.`);
        return response.customError((0, _errors.wrapIntoCustomErrorResponse)(err));
      }
      logger.debug(`Successfully updated user "${userToUpdate.username}".`);
    }
    return response.ok({
      body: {}
    });
  }));
  router.post({
    path: '/internal/security/deprecations/kibana_user_role/_fix_role_mappings',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    const esClient = (await context.core).elasticsearch.client;
    let roleMappings;
    try {
      roleMappings = await esClient.asCurrentUser.security.getRoleMapping();
    } catch (err) {
      logger.error(`Failed to retrieve role mappings: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(err));
    }
    const roleMappingsWithKibanaUserRole = Object.entries(roleMappings).filter(([, mapping]) => mapping.roles.includes(_deprecations.KIBANA_USER_ROLE_NAME));
    if (roleMappingsWithKibanaUserRole.length === 0) {
      logger.debug(`No role mappings with "${_deprecations.KIBANA_USER_ROLE_NAME}" role found.`);
    } else {
      logger.debug(`The following role mappings with "${_deprecations.KIBANA_USER_ROLE_NAME}" role found and will be migrated to "${_deprecations.KIBANA_ADMIN_ROLE_NAME}" role: ${roleMappingsWithKibanaUserRole.map(([mappingName]) => mappingName).join(', ')}.`);
    }
    for (const [mappingNameToUpdate, mappingToUpdate] of roleMappingsWithKibanaUserRole) {
      const roles = mappingToUpdate.roles.filter(role => role !== _deprecations.KIBANA_USER_ROLE_NAME);
      if (!roles.includes(_deprecations.KIBANA_ADMIN_ROLE_NAME)) {
        roles.push(_deprecations.KIBANA_ADMIN_ROLE_NAME);
      }
      try {
        await esClient.asCurrentUser.security.putRoleMapping({
          name: mappingNameToUpdate,
          body: {
            ...mappingToUpdate,
            roles
          }
        });
      } catch (err) {
        logger.error(`Failed to update role mapping "${mappingNameToUpdate}": ${(0, _errors.getDetailedErrorMessage)(err)}.`);
        return response.customError((0, _errors.wrapIntoCustomErrorResponse)(err));
      }
      logger.debug(`Successfully updated role mapping "${mappingNameToUpdate}".`);
    }
    return response.ok({
      body: {}
    });
  }));
}