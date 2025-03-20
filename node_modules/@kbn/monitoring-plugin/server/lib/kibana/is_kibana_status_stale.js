"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isKibanaStatusStale = isKibanaStatusStale;
var _moment = _interopRequireDefault(require("moment"));
var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isKibanaStatusStale(lastSeenTimestamp) {
  const lastSeen = (0, _moment.default)(lastSeenTimestamp);
  const staleThreshold = (0, _moment.default)().subtract(_static_globals.Globals.app.config.ui.kibana.reporting.stale_status_threshold_seconds, 'seconds');
  return staleThreshold.isAfter(lastSeen);
}