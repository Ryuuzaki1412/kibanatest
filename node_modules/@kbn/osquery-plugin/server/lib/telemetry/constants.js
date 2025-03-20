"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TELEMETRY_EBT_SAVED_QUERY_EVENT = exports.TELEMETRY_EBT_PACK_EVENT = exports.TELEMETRY_EBT_LIVE_QUERY_EVENT = exports.TELEMETRY_EBT_CONFIG_EVENT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TELEMETRY_EBT_LIVE_QUERY_EVENT = 'osquery_live_query';
exports.TELEMETRY_EBT_LIVE_QUERY_EVENT = TELEMETRY_EBT_LIVE_QUERY_EVENT;
const TELEMETRY_EBT_PACK_EVENT = 'osquery_pack';
exports.TELEMETRY_EBT_PACK_EVENT = TELEMETRY_EBT_PACK_EVENT;
const TELEMETRY_EBT_SAVED_QUERY_EVENT = 'osquery_saved_query';
exports.TELEMETRY_EBT_SAVED_QUERY_EVENT = TELEMETRY_EBT_SAVED_QUERY_EVENT;
const TELEMETRY_EBT_CONFIG_EVENT = 'osquery_config';
exports.TELEMETRY_EBT_CONFIG_EVENT = TELEMETRY_EBT_CONFIG_EVENT;