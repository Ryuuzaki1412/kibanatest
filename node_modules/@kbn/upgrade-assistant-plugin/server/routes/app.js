"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAppRoutes = registerAppRoutes;
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const extractMissingPrivileges = (privilegesObject = {}) => Object.keys(privilegesObject).reduce((privileges, privilegeName) => {
  if (Object.values(privilegesObject[privilegeName]).some(e => !e)) {
    privileges.push(privilegeName);
  }
  return privileges;
}, []);
function registerAppRoutes({
  router,
  lib: {
    handleEsError
  },
  config: {
    isSecurityEnabled
  }
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/privileges`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    const {
      elasticsearch: {
        client
      }
    } = await core;
    const privilegesResult = {
      hasAllPrivileges: true,
      missingPrivileges: {
        index: []
      }
    };
    if (!isSecurityEnabled()) {
      return response.ok({
        body: privilegesResult
      });
    }
    try {
      const {
        has_all_requested: hasAllPrivileges,
        index
      } = await client.asCurrentUser.security.hasPrivileges({
        body: {
          index: [{
            names: [_constants.DEPRECATION_LOGS_INDEX],
            privileges: ['read']
          }]
        }
      });
      if (!hasAllPrivileges) {
        privilegesResult.missingPrivileges.index = extractMissingPrivileges(index);
      }
      privilegesResult.hasAllPrivileges = hasAllPrivileges;
      return response.ok({
        body: privilegesResult
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}