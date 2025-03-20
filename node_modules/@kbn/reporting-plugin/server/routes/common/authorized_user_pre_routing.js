"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizedUserPreRouting = void 0;
var _i18n = require("@kbn/i18n");
var _get_user = require("./get_user");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const superuserRole = 'superuser';
const authorizedUserPreRouting = (reporting, handler) => {
  const {
    logger,
    security,
    docLinks
  } = reporting.getPluginSetupDeps();
  return async (context, req, res) => {
    const {
      security: securityStart
    } = await reporting.getPluginStartDeps();
    try {
      let user = false;
      if (security && security.license.isEnabled()) {
        // find the authenticated user, or null if security is not enabled
        user = (0, _get_user.getUser)(req, securityStart);
        if (!user) {
          // security is enabled but the user is null
          return res.unauthorized({
            body: `Sorry, you aren't authenticated`
          });
        }
      }
      const deprecatedAllowedRoles = reporting.getDeprecatedAllowedRoles();
      if (user && deprecatedAllowedRoles !== false) {
        // check allowance with the configured set of roleas + "superuser"
        const allowedRoles = deprecatedAllowedRoles || [];
        const authorizedRoles = [superuserRole, ...allowedRoles];
        if (!user.roles.find(role => authorizedRoles.includes(role))) {
          const body = _i18n.i18n.translate('xpack.reporting.userAccessError.message', {
            defaultMessage: `Ask your administrator for access to reporting features. {grantUserAccessDocs}.`,
            values: {
              grantUserAccessDocs: `<a href=${docLinks.links.reporting.grantUserAccess} style="font-weight: 600;"
                    target="_blank" rel="noopener">` + _i18n.i18n.translate('xpack.reporting.userAccessError.learnMoreLink', {
                defaultMessage: 'Learn more'
              }) + '</a>'
            }
          });
          // user's roles do not allow
          return res.forbidden({
            body
          });
        }
      }
      return handler(user, context, req, res);
    } catch (err) {
      logger.error(err);
      return res.custom({
        statusCode: 500
      });
    }
  };
};
exports.authorizedUserPreRouting = authorizedUserPreRouting;