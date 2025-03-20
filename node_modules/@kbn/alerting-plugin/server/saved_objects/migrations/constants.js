"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SIEM_SERVER_APP_ID = exports.SIEM_APP_ID = exports.MINIMUM_SS_MIGRATION_VERSION = exports.LEGACY_LAST_MODIFIED_VERSION = exports.FILEBEAT_7X_INDICATOR_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SIEM_APP_ID = 'securitySolution';
exports.SIEM_APP_ID = SIEM_APP_ID;
const SIEM_SERVER_APP_ID = 'siem';
exports.SIEM_SERVER_APP_ID = SIEM_SERVER_APP_ID;
const MINIMUM_SS_MIGRATION_VERSION = '8.3.0';
exports.MINIMUM_SS_MIGRATION_VERSION = MINIMUM_SS_MIGRATION_VERSION;
const LEGACY_LAST_MODIFIED_VERSION = 'pre-7.10.0';
exports.LEGACY_LAST_MODIFIED_VERSION = LEGACY_LAST_MODIFIED_VERSION;
const FILEBEAT_7X_INDICATOR_PATH = 'threatintel.indicator';
exports.FILEBEAT_7X_INDICATOR_PATH = FILEBEAT_7X_INDICATOR_PATH;