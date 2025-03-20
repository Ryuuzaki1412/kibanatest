"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotificationsQuerySchema = exports.getNotificationsCountQuerySchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNotificationsQuerySchema = _configSchema.schema.object({
  /**
   * Search string for the message content
   */
  queryString: _configSchema.schema.maybe(_configSchema.schema.string()),
  /**
   * Sort field
   */
  sortField: _configSchema.schema.oneOf([_configSchema.schema.literal('timestamp'), _configSchema.schema.literal('level'), _configSchema.schema.literal('job_type'), _configSchema.schema.literal('job_id')], {
    defaultValue: 'timestamp'
  }),
  /**
   * Sort direction
   */
  sortDirection: _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')], {
    defaultValue: 'desc'
  }),
  earliest: _configSchema.schema.maybe(_configSchema.schema.string()),
  latest: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.getNotificationsQuerySchema = getNotificationsQuerySchema;
const getNotificationsCountQuerySchema = _configSchema.schema.object({
  lastCheckedAt: _configSchema.schema.number()
});
exports.getNotificationsCountQuerySchema = getNotificationsCountQuerySchema;