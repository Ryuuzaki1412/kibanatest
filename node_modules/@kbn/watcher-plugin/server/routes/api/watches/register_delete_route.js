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

const bodySchema = _configSchema.schema.object({
  watchIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
});
function deleteWatches(dataClient, watchIds) {
  const deletePromises = watchIds.map(watchId => {
    return dataClient.asCurrentUser.watcher.deleteWatch({
      id: watchId
    }).then(success => ({
      success
    })).catch(error => ({
      error
    }));
  });
  return Promise.all(deletePromises).then(results => {
    const errors = [];
    const successes = [];
    results.forEach(({
      success,
      error
    }) => {
      if (success) {
        successes.push(success._id);
      } else if (error) {
        errors.push(error._id);
      }
    });
    return {
      successes,
      errors
    };
  });
}
function registerDeleteRoute({
  router,
  license
}) {
  router.post({
    path: '/api/watcher/watches/delete',
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const esClient = (await ctx.core).elasticsearch.client;
    const results = await deleteWatches(esClient, request.body.watchIds);
    return response.ok({
      body: {
        results
      }
    });
  }));
}