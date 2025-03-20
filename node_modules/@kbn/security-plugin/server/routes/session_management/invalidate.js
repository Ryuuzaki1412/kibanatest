"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineInvalidateSessionsRoutes = defineInvalidateSessionsRoutes;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for session invalidation.
 */
function defineInvalidateSessionsRoutes({
  router,
  getSession
}) {
  router.post({
    path: '/api/security/session/_invalidate',
    validate: {
      body: _configSchema.schema.object({
        match: _configSchema.schema.oneOf([_configSchema.schema.literal('all'), _configSchema.schema.literal('query')]),
        query: _configSchema.schema.conditional(_configSchema.schema.siblingRef('match'), _configSchema.schema.literal('query'), _configSchema.schema.object({
          provider: _configSchema.schema.object({
            type: _configSchema.schema.string(),
            name: _configSchema.schema.maybe(_configSchema.schema.string())
          }),
          username: _configSchema.schema.maybe(_configSchema.schema.string())
        }), _configSchema.schema.never())
      })
    },
    options: {
      tags: ['access:sessionManagement']
    }
  }, async (_context, request, response) => {
    return response.ok({
      body: {
        total: await getSession().invalidate(request, {
          match: request.body.match,
          query: request.body.query
        })
      }
    });
  });
}