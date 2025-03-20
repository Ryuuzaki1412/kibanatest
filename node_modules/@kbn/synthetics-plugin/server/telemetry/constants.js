"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MONITOR_UPDATE_CHANNEL = exports.MONITOR_SYNC_STATE_CHANNEL = exports.MONITOR_SYNC_EVENTS_CHANNEL = exports.MONITOR_ERROR_EVENTS_CHANNEL = exports.MONITOR_CURRENT_CHANNEL = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MONITOR_UPDATE_CHANNEL = 'synthetics-monitor-update';
exports.MONITOR_UPDATE_CHANNEL = MONITOR_UPDATE_CHANNEL;
const MONITOR_CURRENT_CHANNEL = 'synthetics-monitor-current';
exports.MONITOR_CURRENT_CHANNEL = MONITOR_CURRENT_CHANNEL;
const MONITOR_ERROR_EVENTS_CHANNEL = 'synthetics-monitor-error-events';
exports.MONITOR_ERROR_EVENTS_CHANNEL = MONITOR_ERROR_EVENTS_CHANNEL;
const MONITOR_SYNC_STATE_CHANNEL = 'synthetics-monitor-sync-state';
exports.MONITOR_SYNC_STATE_CHANNEL = MONITOR_SYNC_STATE_CHANNEL;
const MONITOR_SYNC_EVENTS_CHANNEL = 'synthetics-monitor-sync-events';
exports.MONITOR_SYNC_EVENTS_CHANNEL = MONITOR_SYNC_EVENTS_CHANNEL;