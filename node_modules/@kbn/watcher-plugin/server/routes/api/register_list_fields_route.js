"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListFieldsRoute = registerListFieldsRoute;
var _configSchema = require("@kbn/config-schema");
var _fields = require("../../models/fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

const bodySchema = _configSchema.schema.object({
  indexes: _configSchema.schema.arrayOf(_configSchema.schema.string())
});
function fetchFields(dataClient, indexes) {
  return dataClient.asCurrentUser.fieldCaps({
    index: indexes,
    fields: ['*'],
    allow_no_indices: true,
    ignore_unavailable: true
  }, {
    ignore: [404],
    meta: true
  });
}
function registerListFieldsRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: '/api/watcher/fields',
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, request, response) => {
    const {
      indexes
    } = request.body;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const fieldsResponse = await fetchFields(esClient, indexes);
      const json = fieldsResponse.statusCode === 404 ? {
        fields: []
      } : fieldsResponse.body;
      const fields = _fields.Fields.fromUpstreamJson(json);
      return response.ok({
        body: fields.downstreamJson
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response
      });
    }
  }));
}