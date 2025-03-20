"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogsAppAlertUrl = void 0;
var _std = require("@kbn/std");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLogsAppAlertUrl = timestamp => (0, _std.modifyUrl)('/app/logs/link-to/default/logs', ({
  query,
  ...otherUrlParts
}) => ({
  ...otherUrlParts,
  query: {
    ...query,
    ...(timestamp != null ? {
      time: `${timestamp}`
    } : {})
  }
}));
exports.getLogsAppAlertUrl = getLogsAppAlertUrl;