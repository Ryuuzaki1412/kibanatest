"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _split_interval = _interopRequireDefault(require("./split_interval"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function _default(tlConfig) {
  const targetSeries = [];
  // The code between this call and the reset in the finally block is not allowed to get async,
  // otherwise the timezone setting can leak out of this function.
  const defaultTimezone = (0, _momentTimezone.default)().zoneName();
  try {
    _momentTimezone.default.tz.setDefault(tlConfig.time.timezone);
    const min = (0, _momentTimezone.default)(tlConfig.time.from);
    const max = (0, _momentTimezone.default)(tlConfig.time.to);
    const intervalParts = (0, _split_interval.default)(tlConfig.time.interval);
    let current = min.startOf(intervalParts.unit);
    while (current.valueOf() < max.valueOf()) {
      targetSeries.push(current.valueOf());
      current = current.add(intervalParts.count, intervalParts.unit);
    }
  } finally {
    // reset default moment timezone
    _momentTimezone.default.tz.setDefault(defaultTimezone);
  }
  return targetSeries;
}
module.exports = exports.default;