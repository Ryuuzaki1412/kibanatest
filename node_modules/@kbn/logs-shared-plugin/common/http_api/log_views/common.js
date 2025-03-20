"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogViewUrl = exports.LOG_VIEW_URL_PREFIX = exports.LOG_VIEW_URL = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const LOG_VIEW_URL_PREFIX = '/api/infra/log_views';
exports.LOG_VIEW_URL_PREFIX = LOG_VIEW_URL_PREFIX;
const LOG_VIEW_URL = `${LOG_VIEW_URL_PREFIX}/{logViewId}`;
exports.LOG_VIEW_URL = LOG_VIEW_URL;
const getLogViewUrl = logViewId => `${LOG_VIEW_URL_PREFIX}/${logViewId}`;
exports.getLogViewUrl = getLogViewUrl;