"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runSoonRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("./lib");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
const runSoonRoute = (router, licenseState) => {
  router.post({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}/_run_soon`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const message = await rulesClient.runSoon(req.params);
    return message ? res.ok({
      body: message
    }) : res.noContent();
  })));
};
exports.runSoonRoute = runSoonRoute;