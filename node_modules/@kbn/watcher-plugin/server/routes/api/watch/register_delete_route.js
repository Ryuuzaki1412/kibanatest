"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = registerDeleteRoute;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramsSchema = _configSchema.schema.object({
  watchId: _configSchema.schema.string()
});
function deleteWatch(dataClient, watchId) {
  return dataClient.asCurrentUser.watcher.deleteWatch({
    id: watchId
  });
}
function registerDeleteRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.delete({
    path: '/api/watcher/watch/{watchId}',
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const {
      watchId
    } = request.params;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      return response.ok({
        body: await deleteWatch(esClient, watchId)
      });
    } catch (e) {
      var _e$meta, _e$meta$body;
      if ((e === null || e === void 0 ? void 0 : e.statusCode) === 404 && (_e$meta = e.meta) !== null && _e$meta !== void 0 && (_e$meta$body = _e$meta.body) !== null && _e$meta$body !== void 0 && _e$meta$body.error) {
        e.meta.body.error.reason = `Watch with id = ${watchId} not found`;
      }
      return handleEsError({
        error: e,
        response
      });
    }
  }));
}