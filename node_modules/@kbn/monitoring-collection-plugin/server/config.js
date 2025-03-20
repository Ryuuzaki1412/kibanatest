"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;
exports.createConfig = createConfig;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  opentelemetry: _configSchema.schema.object({
    metrics: _configSchema.schema.object({
      otlp: _configSchema.schema.object({
        url: _configSchema.schema.maybe(_configSchema.schema.string()),
        headers: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string())),
        exportIntervalMillis: _configSchema.schema.number({
          defaultValue: 10000
        }),
        logLevel: _configSchema.schema.string({
          defaultValue: 'info'
        })
      }),
      prometheus: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    })
  })
});
exports.configSchema = configSchema;
function createConfig(config) {
  return config;
}