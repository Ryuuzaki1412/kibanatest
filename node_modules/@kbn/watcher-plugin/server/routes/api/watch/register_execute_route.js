"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExecuteRoute = registerExecuteRoute;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _execute_details = require("../../../models/execute_details");
var _watch = require("../../../models/watch");
var _watch_history_item = require("../../../models/watch_history_item");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

// @ts-ignore

// @ts-ignore

const bodySchema = _configSchema.schema.object({
  executeDetails: _configSchema.schema.object({}, {
    unknowns: 'allow'
  }),
  watch: _configSchema.schema.object({}, {
    unknowns: 'allow'
  })
});
function executeWatch(dataClient, executeDetails, watchJson) {
  const body = executeDetails;
  body.watch = watchJson;
  return dataClient.asCurrentUser.watcher.executeWatch({
    body
  }).then(returnValue => returnValue);
}
function registerExecuteRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.put({
    path: '/api/watcher/watch/execute',
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const executeDetails = _execute_details.ExecuteDetails.fromDownstreamJson(request.body.executeDetails);
    const watch = _watch.Watch.fromDownstreamJson(request.body.watch);
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const hit = await executeWatch(esClient, executeDetails.upstreamJson, watch.watchJson);
      const id = (0, _lodash.get)(hit, '_id');
      const watchHistoryItemJson = (0, _lodash.get)(hit, 'watch_record');
      const watchId = (0, _lodash.get)(hit, 'watch_record.watch_id');
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