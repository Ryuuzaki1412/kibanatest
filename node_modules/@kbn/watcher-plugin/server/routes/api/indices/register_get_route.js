"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = registerGetRoute;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bodySchema = _configSchema.schema.object({
  pattern: _configSchema.schema.string()
}, {
  unknowns: 'allow'
});
function getIndexNamesFromAliasesResponse(json) {
  return (0, _lodash.reduce)(json, (list, {
    aliases
  }, indexName) => {
    list.push(indexName);
    if ((0, _lodash.size)(aliases) > 0) {
      list.push(...Object.keys(aliases));
    }
    return list;
  }, []);
}
async function getIndices(dataClient, pattern, limit = 10) {
  const aliasResult = await dataClient.asCurrentUser.indices.getAlias({
    index: pattern
  }, {
    ignore: [404],
    meta: true
  });
  if (aliasResult.statusCode !== 404) {
    const indicesFromAliasResponse = getIndexNamesFromAliasesResponse(aliasResult.body);
    return indicesFromAliasResponse.slice(0, limit);
  }
  const response = await dataClient.asCurrentUser.search({
    index: pattern,
    body: {
      size: 0,
      // no hits
      aggs: {
        indices: {
          terms: {
            field: '_index',
            size: limit
          }
        }
      }
    }
  }, {
    ignore: [404],
    meta: true
  });
  if (response.statusCode === 404 || !response.body.aggregations) {
    return [];
  }
  const indices = response.body.aggregations.indices;
  return indices.buckets ? indices.buckets.map(bucket => bucket.key) : [];
}
function registerGetRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: '/api/watcher/indices',
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const {
      pattern
    } = request.body;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const indices = await getIndices(esClient, pattern);
      return response.ok({
        body: {
          indices
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