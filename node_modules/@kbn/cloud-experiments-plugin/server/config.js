"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const launchDarklySchema = _configSchema.schema.object({
  sdk_key: _configSchema.schema.string({
    minLength: 1
  }),
  client_id: _configSchema.schema.string({
    minLength: 1
  }),
  client_log_level: _configSchema.schema.oneOf([_configSchema.schema.literal('none'), _configSchema.schema.literal('error'), _configSchema.schema.literal('warn'), _configSchema.schema.literal('info'), _configSchema.schema.literal('debug')], {
    defaultValue: 'none'
  })
});
const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  launch_darkly: _configSchema.schema.conditional(_configSchema.schema.siblingRef('enabled'), true, _configSchema.schema.conditional(_configSchema.schema.contextRef('dev'), _configSchema.schema.literal(true),
  // this is still optional when running on dev because devs might use the `flag_overrides`
  _configSchema.schema.maybe(launchDarklySchema), launchDarklySchema), _configSchema.schema.maybe(launchDarklySchema)),
  flag_overrides: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
  metadata_refresh_interval: _configSchema.schema.duration({
    defaultValue: '1h'
  })
});
const config = {
  exposeToBrowser: {
    launch_darkly: {
      client_id: true,
      client_log_level: true
    },
    flag_overrides: true,
    metadata_refresh_interval: true
  },
  schema: configSchema
};
exports.config = config;