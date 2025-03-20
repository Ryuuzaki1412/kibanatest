"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalExecutionKPIRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _types = require("../types");
var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const querySchema = _configSchema.schema.object({
  date_start: _configSchema.schema.string(),
  date_end: _configSchema.schema.maybe(_configSchema.schema.string()),
  filter: _configSchema.schema.maybe(_configSchema.schema.string()),
  namespaces: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});
const rewriteReq = ({
  date_start: dateStart,
  date_end: dateEnd,
  namespaces,
  ...rest
}) => ({
  ...rest,
  namespaces: (0, _lib.rewriteNamespaces)(namespaces),
  dateStart,
  dateEnd
});
const getGlobalExecutionKPIRoute = (router, licenseState) => {
  router.get({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/_global_execution_kpi`,
    validate: {
      query: querySchema
    }
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    return res.ok({
      body: await rulesClient.getGlobalExecutionKpiWithAuth(rewriteReq(req.query))
    });
  })));
};
exports.getGlobalExecutionKPIRoute = getGlobalExecutionKPIRoute;