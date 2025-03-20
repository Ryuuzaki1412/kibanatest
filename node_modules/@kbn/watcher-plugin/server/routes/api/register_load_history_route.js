"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLoadHistoryRoute = registerLoadHistoryRoute;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _constants = require("../../../common/constants");
var _watch_history_item = require("../../models/watch_history_item");
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
function fetchHistoryItem(dataClient, watchHistoryItemId) {
  return dataClient.asCurrentUser.search({
    index: _constants.INDEX_NAMES.WATCHER_HISTORY,
    body: {
      query: {
        bool: {
          must: [{
            term: {
              _id: watchHistoryItemId
            }
          }]
        }
      }
    }
  });
}
function registerLoadHistoryRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: '/api/watcher/history/{id}',
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const id = request.params.id;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const responseFromES = await fetchHistoryItem(esClient, id);
      const hit = (0, _lodash.get)(responseFromES, 'hits.hits[0]');
      if (!hit) {
        return response.notFound({
          body: `Watch History Item with id = ${id} not found`
        });
      }
      const watchHistoryItemJson = (0, _lodash.get)(hit, '_source');
      const watchId = (0, _lodash.get)(hit, '_source.watch_id');
      const json = {
        id,
        watchId,
        watchHistoryItemJson,
        includeDetails: true
      };
      const watchHistoryItem = _watch_history_item.WatchHistoryItem.fromUpstreamJson(json);
      return response.ok({
        body: {
          watchHistoryItem: watchHistoryItem.downstreamJson
        }
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response
      });
    }
  }));
}