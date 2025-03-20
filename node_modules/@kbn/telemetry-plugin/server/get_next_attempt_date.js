"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextAttemptDate = getNextAttemptDate;
var _crypto = require("crypto");
var _moment = _interopRequireDefault(require("moment"));
var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const REPORT_INTERVAL_BUFFER_S = _constants.REPORT_INTERVAL_BUFFER_MS / 1000;

/**
 * Returns the next attempt to send telemetry
 * @param fromMs The last attempt in ms from epoch
 */
function getNextAttemptDate(fromMs) {
  const lastAttempt = (0, _moment.default)(fromMs).utcOffset(0);
  const endOfLastAttemptDay = lastAttempt.clone().endOf('day');
  const dayPlusReportInterval = lastAttempt.clone().add(_constants.REPORT_INTERVAL_MS, 'milliseconds');
  const endOfNextDay = dayPlusReportInterval.clone().endOf('day');
  const nextAttemptDate = dayPlusReportInterval.clone().add((0, _crypto.randomInt)(-REPORT_INTERVAL_BUFFER_S, REPORT_INTERVAL_BUFFER_S), 'seconds');

  // Edge case: If the random seed makes the next attempt to be in the same day of the last attempt, generate it again
  if (nextAttemptDate.isBefore(endOfLastAttemptDay)) {
    return getNextAttemptDate(fromMs);
  }

  // Edge case: If the random seed goes to the following day, generate it again
  if (nextAttemptDate.isAfter(endOfNextDay)) {
    return getNextAttemptDate(fromMs);
  }
  return nextAttemptDate.toDate();
}