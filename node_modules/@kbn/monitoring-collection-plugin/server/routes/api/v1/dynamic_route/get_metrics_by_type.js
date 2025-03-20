"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDynamicRoute = registerDynamicRoute;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../../../../lib");
var _constants = require("../../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerDynamicRoute({
  router,
  config,
  getStatus,
  getMetric
}) {
  router.get({
    path: `${_constants.MONITORING_COLLECTION_BASE_PATH}/{type}`,
    options: {
      authRequired: true,
      tags: ['api'] // ensures that unauthenticated calls receive a 401 rather than a 302 redirect to login page
    },

    validate: {
      params: _configSchema.schema.object({
        type: _configSchema.schema.string()
      })
    }
  }, async (context, req, res) => {
    const type = req.params.type;
    const esClient = (await context.core).elasticsearch.client;
    const [data, clusterUuid, kibana] = await Promise.all([getMetric(type), (0, _lib.getESClusterUuid)(esClient), (0, _lib.getKibanaStats)({
      config,
      getStatus
    })]);
    return res.ok({
      body: {
        [type]: data,
        cluster_uuid: clusterUuid,
        kibana
      }
    });
  });
}