"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLoadRoute = registerLoadRoute;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _watch = require("../../../models/watch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

const paramsSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
function fetchWatch(dataClient, watchId) {
  return dataClient.asCurrentUser.watcher.getWatch({
    id: watchId
  });
}
function registerLoadRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: '/api/watcher/watch/{id}',
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const id = request.params.id;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const hit = await fetchWatch(esClient, id);
      const watchJson = (0, _lodash.get)(hit, 'watch');
      const watchStatusJson = (0, _lodash.get)(hit, 'status');
      const json = {
        id,
        watchJson,
        watchStatusJson
      };
      const watch = _watch.Watch.fromUpstreamJson(json, {
        throwExceptions: {
          Action: false
        }
      });
      return response.ok({
        body: {
          watch: watch.downstreamJson
        }
      });
    } catch (e) {
      var _e$meta, _e$meta$body;
      if ((e === null || e === void 0 ? void 0 : e.statusCode) === 404 && (_e$meta = e.meta) !== null && _e$meta !== void 0 && (_e$meta$body = _e$meta.body) !== null && _e$meta$body !== void 0 && _e$meta$body.error) {
        e.meta.body.error.reason = `Watch with id = ${id} not found`;
      }
      return handleEsError({
        error: e,
        response
      });
    }
  }));
}