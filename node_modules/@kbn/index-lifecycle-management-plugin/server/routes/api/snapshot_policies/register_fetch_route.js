"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = registerFetchRoute;
var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerFetchRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _services.addBasePath)('/snapshot_policies'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const esClient = (await context.core).elasticsearch.client;
      const policiesByName = await esClient.asCurrentUser.slm.getLifecycle();
      return response.ok({
        body: Object.keys(policiesByName)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}