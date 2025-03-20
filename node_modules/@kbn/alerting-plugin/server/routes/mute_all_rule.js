"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.muteAllRuleRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../lib");
var _lib2 = require("./lib");
var _types = require("../types");
var _track_deprecated_route_usage = require("../lib/track_deprecated_route_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
const muteAllRuleRoute = (router, licenseState, usageCounter) => {
  router.post({
    path: `${_types.BASE_ALERTING_API_PATH}/rule/{id}/_mute_all`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _lib2.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const {
      id
    } = req.params;
    (0, _track_deprecated_route_usage.trackDeprecatedRouteUsage)('muteAll', usageCounter);
    try {
      await rulesClient.muteAll({
        id
      });
      return res.noContent();
    } catch (e) {
      if (e instanceof _lib.RuleTypeDisabledError) {
        return e.sendResponse(res);
      }
      throw e;
    }
  })));
};
exports.muteAllRuleRoute = muteAllRuleRoute;