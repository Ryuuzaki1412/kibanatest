"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkEnableRulesRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("./lib");
var _lib2 = require("../lib");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bulkEnableRulesRoute = ({
  router,
  licenseState
}) => {
  router.patch({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rules/_bulk_enable`,
    validate: {
      body: _configSchema.schema.object({
        filter: _configSchema.schema.maybe(_configSchema.schema.string()),
        ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
          minSize: 1,
          maxSize: 1000
        }))
      })
    }
  }, (0, _lib.handleDisabledApiKeysError)(router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async (context, req, res) => {
    const rulesClient = (await context.alerting).getRulesClient();
    const {
      filter,
      ids
    } = req.body;
    try {
      const result = await rulesClient.bulkEnableRules({
        filter,
        ids
      });
      return res.ok({
        body: result
      });
    } catch (e) {
      if (e instanceof _lib2.RuleTypeDisabledError) {
        return e.sendResponse(res);
      }
      throw e;
    }
  }))));
};
exports.bulkEnableRulesRoute = bulkEnableRulesRoute;