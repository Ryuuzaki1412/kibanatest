"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListRoute = registerListRoute;
var _lodash = require("lodash");
var _fetch_all_from_scroll = require("../../../lib/fetch_all_from_scroll");
var _constants = require("../../../../common/constants");
var _watch = require("../../../models/watch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

function fetchWatches(dataClient) {
  return dataClient.asCurrentUser.search({
    index: _constants.INDEX_NAMES.WATCHES,
    scroll: _constants.ES_SCROLL_SETTINGS.KEEPALIVE,
    body: {
      size: _constants.ES_SCROLL_SETTINGS.PAGE_SIZE
    }
  }, {
    ignore: [404]
  }).then(body => (0, _fetch_all_from_scroll.fetchAllFromScroll)(body, dataClient));
}
function registerListRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: '/api/watcher/watches',
    validate: false
  }, license.guardApiRoute(async (ctx, request, response) => {
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const hits = await fetchWatches(esClient);
      const watches = hits.map(hit => {
        const id = (0, _lodash.get)(hit, '_id');
        const watchJson = (0, _lodash.get)(hit, '_source');
        const watchStatusJson = (0, _lodash.get)(hit, '_source.status');
        return _watch.Watch.fromUpstreamJson({
          id,
          watchJson,
          watchStatusJson
        }, {
          throwExceptions: {
            Action: false
          }
        });
      });
      return response.ok({
        body: {
          watches: watches.map(watch => watch.downstreamJson)
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