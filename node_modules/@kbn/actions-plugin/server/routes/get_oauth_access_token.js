"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOAuthAccessToken = void 0;
var _configSchema = require("@kbn/config-schema");
var _common = require("../../common");
var _verify_access_and_context = require("./verify_access_and_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const oauthJwtBodySchema = _configSchema.schema.object({
  tokenUrl: _configSchema.schema.string(),
  config: _configSchema.schema.object({
    clientId: _configSchema.schema.string(),
    jwtKeyId: _configSchema.schema.string(),
    userIdentifierValue: _configSchema.schema.string()
  }),
  secrets: _configSchema.schema.object({
    clientSecret: _configSchema.schema.string(),
    privateKey: _configSchema.schema.string(),
    privateKeyPassword: _configSchema.schema.maybe(_configSchema.schema.string())
  })
});
const oauthClientCredentialsBodySchema = _configSchema.schema.object({
  tokenUrl: _configSchema.schema.string(),
  scope: _configSchema.schema.string(),
  config: _configSchema.schema.object({
    clientId: _configSchema.schema.string(),
    tenantId: _configSchema.schema.string()
  }),
  secrets: _configSchema.schema.object({
    clientSecret: _configSchema.schema.string()
  })
});
const bodySchema = _configSchema.schema.object({
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('jwt'), _configSchema.schema.literal('client')]),
  options: _configSchema.schema.conditional(_configSchema.schema.siblingRef('type'), _configSchema.schema.literal('jwt'), oauthJwtBodySchema, oauthClientCredentialsBodySchema)
});
const getOAuthAccessToken = (router, licenseState, configurationUtilities) => {
  router.post({
    path: `${_common.INTERNAL_BASE_ACTION_API_PATH}/connector/_oauth_access_token`,
    validate: {
      body: bodySchema
    }
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = (await context.actions).getActionsClient();
    return res.ok({
      body: await actionsClient.getOAuthAccessToken(req.body, configurationUtilities)
    });
  })));
};
exports.getOAuthAccessToken = getOAuthAccessToken;