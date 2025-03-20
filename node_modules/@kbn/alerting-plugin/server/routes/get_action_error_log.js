"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionErrorLogRoute = void 0;
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
const sortOrderSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')]);
const sortFieldSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  '@timestamp': _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  'event.duration': _configSchema.schema.object({
    order: sortOrderSchema
  })
})]);
const sortFieldsSchema = _configSchema.schema.arrayOf(sortFieldSchema, {
  defaultValue: [{
    '@timestamp': {
      order: 'desc'
    }
  }]
});
const querySchema = _configSchema.schema.object({
  date_start: _configSchema.schema.string(),
  date_end: _configSchema.schema.maybe(_configSchema.schema.string()),
  filter: _configSchema.schema.maybe(_configSchema.schema.string()),
  per_page: _configSchema.schema.number({
    defaultValue: 10,
    min: 1
  }),
  page: _configSchema.schema.number({
    defaultValue: 1,
    min: 1
  }),
  sort: sortFieldsSchema,
  namespace: _configSchema.schema.maybe(_configSchema.schema.string()),
  with_auth: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
const rewriteReq = ({
  date_start: dateStart,
  date_end: dateEnd,
  per_page: perPage,
  namespace,
  ...rest
}) => ({
  ...rest,
  namespace,
  dateStart,
  dateEnd,
  perPage
});
const getActionErrorLogRoute = (router, licenseState) => {
  router.get({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}/_action_error_log`,
    validate: {
      params: paramSchema,
      query: querySchema
    }
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const {
      id
    } = req.params;
    const withAuth = req.query.with_auth;
    const rewrittenReq = rewriteReq({
      id,
      ...req.query
    });
    const getter = (withAuth ? rulesClient.getActionErrorLogWithAuth : rulesClient.getActionErrorLog).bind(rulesClient);
    return res.ok({
      body: await getter(rewrittenReq)
    });
  })));
};
exports.getActionErrorLogRoute = getActionErrorLogRoute;