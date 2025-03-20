"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const configSchema = _configSchema.schema.object({
  autocomplete: _configSchema.schema.object({
    querySuggestions: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    }),
    valueSuggestions: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      tiers: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal('data_content'), _configSchema.schema.literal('data_hot'), _configSchema.schema.literal('data_warm'), _configSchema.schema.literal('data_cold'), _configSchema.schema.literal('data_frozen')]), {
        defaultValue: ['data_hot', 'data_warm', 'data_content', 'data_cold']
      }),
      terminateAfter: _configSchema.schema.duration({
        defaultValue: 100000
      }),
      timeout: _configSchema.schema.duration({
        defaultValue: 1000
      })
    })
  })
});
exports.configSchema = configSchema;