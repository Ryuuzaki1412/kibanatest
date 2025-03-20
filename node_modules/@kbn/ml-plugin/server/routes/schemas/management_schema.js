"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listTypeSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const listTypeSchema = _configSchema.schema.object({
  listType: _configSchema.schema.oneOf([_configSchema.schema.literal('anomaly-detector'), _configSchema.schema.literal('data-frame-analytics'), _configSchema.schema.literal('trained-model')])
});
exports.listTypeSchema = listTypeSchema;