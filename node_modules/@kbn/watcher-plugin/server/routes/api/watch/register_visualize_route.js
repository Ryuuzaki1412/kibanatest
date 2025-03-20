"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerVisualizeRoute = registerVisualizeRoute;
var _configSchema = require("@kbn/config-schema");
var _watch = require("../../../models/watch");
var _visualize_options = require("../../../models/visualize_options");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

// @ts-ignore

const bodySchema = _configSchema.schema.object({
  watch: _configSchema.schema.object({}, {
    unknowns: 'allow'
  }),
  options: _configSchema.schema.object({}, {
    unknowns: 'allow'
  })
});
function fetchVisualizeData(dataClient, index, body) {
  return dataClient.asCurrentUser.search({
    index,
    body,
    allow_no_indices: true,
    ignore_unavailable: true
  }, {
    ignore: [404]
  }).then(result => result);
}
function registerVisualizeRoute({
  router,
  license,
  lib: {
    handleEsError
  },
  kibanaVersion
}) {
  router.post({
    path: '/api/watcher/watch/visualize',
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const watch = _watch.Watch.fromDownstreamJson(request.body.watch);
    const options = _visualize_options.VisualizeOptions.fromDownstreamJson(request.body.options);
    const body = watch.getVisualizeQuery(options, kibanaVersion);
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const hits = await fetchVisualizeData(esClient, watch.index, body);
      const visualizeData = watch.formatVisualizeData(hits);
      return response.ok({
        body: {
          visualizeData
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