"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetIndexPatternsRoute = registerGetIndexPatternsRoute;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerGetIndexPatternsRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: '/api/watcher/indices/index_patterns',
    validate: false
  }, license.guardApiRoute(async ({
    core
  }, request, response) => {
    try {
      const {
        savedObjects
      } = await core;
      const finder = savedObjects.client.createPointInTimeFinder({
        type: 'index-pattern',
        fields: ['title'],
        perPage: 1000
      });
      const responses = [];
      for await (const result of finder.find()) {
        responses.push(...result.saved_objects.map(indexPattern => indexPattern.attributes.title));
      }
      await finder.close();
      return response.ok({
        body: responses
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}