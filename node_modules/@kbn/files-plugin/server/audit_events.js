"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAuditEvent = createAuditEvent;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function createAuditEvent({
  message,
  action,
  error,
  outcome
}) {
  return {
    message,
    event: {
      action,
      outcome: (outcome !== null && outcome !== void 0 ? outcome : error) ? 'failure' : 'success'
    },
    error: error && {
      message: error === null || error === void 0 ? void 0 : error.message
    }
  };
}