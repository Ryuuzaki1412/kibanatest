"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAnonymousAccessGetStateRoutes = defineAnonymousAccessGetStateRoutes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines route that returns the state of anonymous access -- whether anonymous access is enabled, and what additional parameters should be
 * added to the URL (if any).
 */
function defineAnonymousAccessGetStateRoutes({
  router,
  getAnonymousAccessService
}) {
  router.get({
    path: '/internal/security/anonymous_access/state',
    validate: false
  }, async (_context, _request, response) => {
    const anonymousAccessService = getAnonymousAccessService();
    const accessURLParameters = anonymousAccessService.accessURLParameters ? Object.fromEntries(anonymousAccessService.accessURLParameters.entries()) : null;
    const responseBody = {
      isEnabled: anonymousAccessService.isAnonymousAccessEnabled,
      accessURLParameters
    };
    return response.ok({
      body: responseBody
    });
  });
}