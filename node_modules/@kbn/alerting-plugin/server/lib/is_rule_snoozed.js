"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveScheduledSnoozes = getActiveScheduledSnoozes;
exports.getActiveSnoozes = getActiveSnoozes;
exports.getRuleSnoozeEndTime = getRuleSnoozeEndTime;
exports.isRuleSnoozed = isRuleSnoozed;
var _lodash = require("lodash");
var _is_snooze_active = require("./snooze/is_snooze_active");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getActiveSnoozes(rule) {
  if (rule.snoozeSchedule == null || (0, _lodash.isEmpty)(rule.snoozeSchedule)) {
    return null;
  }
  return rule.snoozeSchedule.map(snooze => (0, _is_snooze_active.isSnoozeActive)(snooze)).filter(Boolean)
  // Sort in descending snoozeEndTime order
  .sort((a, b) => b.snoozeEndTime.getTime() - a.snoozeEndTime.getTime());
}
function getActiveScheduledSnoozes(rule) {
  var _getActiveSnoozes$fil, _getActiveSnoozes;
  return (_getActiveSnoozes$fil = (_getActiveSnoozes = getActiveSnoozes(rule)) === null || _getActiveSnoozes === void 0 ? void 0 : _getActiveSnoozes.filter(r => Boolean(r.id))) !== null && _getActiveSnoozes$fil !== void 0 ? _getActiveSnoozes$fil : null;
}
function getRuleSnoozeEndTime(rule) {
  var _first$snoozeEndTime, _first;
  return (_first$snoozeEndTime = (_first = (0, _lodash.first)(getActiveSnoozes(rule))) === null || _first === void 0 ? void 0 : _first.snoozeEndTime) !== null && _first$snoozeEndTime !== void 0 ? _first$snoozeEndTime : null;
}
function isRuleSnoozed(rule) {
  if (rule.muteAll) {
    return true;
  }
  return Boolean(getRuleSnoozeEndTime(rule));
}