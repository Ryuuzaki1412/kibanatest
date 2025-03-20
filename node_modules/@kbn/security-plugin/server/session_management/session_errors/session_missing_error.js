"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionMissingError = void 0;
var _session_error = require("./session_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SessionMissingError extends _session_error.SessionError {
  constructor() {
    super(_session_error.SessionErrorReason.SESSION_MISSING, _session_error.SessionErrorReason.SESSION_MISSING);
  }
}
exports.SessionMissingError = SessionMissingError;