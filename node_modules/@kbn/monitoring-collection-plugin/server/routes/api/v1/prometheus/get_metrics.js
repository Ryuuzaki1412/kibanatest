"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROMETHEUS_PATH = void 0;
exports.registerV1PrometheusRoute = registerV1PrometheusRoute;
var _constants = require("../../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PROMETHEUS_PATH = `${_constants.MONITORING_COLLECTION_BASE_PATH}/v1/prometheus`;
exports.PROMETHEUS_PATH = PROMETHEUS_PATH;
function registerV1PrometheusRoute({
  router,
  prometheusExporter
}) {
  router.get({
    path: PROMETHEUS_PATH,
    options: {
      authRequired: true,
      tags: ['api'] // ensures that unauthenticated calls receive a 401 rather than a 302 redirect to login page
    },

    validate: {}
  }, async (_context, _req, res) => {
    return prometheusExporter.exportMetrics(res);
  });
}