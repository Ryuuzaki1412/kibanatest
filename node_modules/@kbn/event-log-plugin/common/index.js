"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BASE_EVENT_LOG_API_PATH = void 0;
Object.defineProperty(exports, "millisToNanos", {
  enumerable: true,
  get: function () {
    return _lib.millisToNanos;
  }
});
Object.defineProperty(exports, "nanosToMillis", {
  enumerable: true,
  get: function () {
    return _lib.nanosToMillis;
  }
});
var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BASE_EVENT_LOG_API_PATH = '/internal/event_log';
exports.BASE_EVENT_LOG_API_PATH = BASE_EVENT_LOG_API_PATH;