"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.INDEX_PREFIX = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const config = {
  deprecations: ({
    unused
  }) => [unused('unsafe.indexUpgrade.enabled', {
    level: 'warning'
  })],
  schema: _configSchema.schema.object({
    write: _configSchema.schema.object({
      disabledRegistrationContexts: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
        defaultValue: []
      }),
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      cache: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: true
        })
      })
    }),
    unsafe: _configSchema.schema.object({
      legacyMultiTenancy: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      indexUpgrade: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    })
  })
};
exports.config = config;
const INDEX_PREFIX = '.alerts';
exports.INDEX_PREFIX = INDEX_PREFIX;