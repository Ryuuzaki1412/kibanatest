"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleToMilli = scheduleToMilli;
exports.scheduleToMinutes = scheduleToMinutes;
var _runtime_types = require("../runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function scheduleToMilli(schedule) {
  const timeValue = parseInt(schedule.number, 10);
  return timeValue * getMilliFactorForScheduleUnit(schedule.unit);
}
function scheduleToMinutes(schedule) {
  return Math.floor(scheduleToMilli(schedule) / (60 * 1000));
}
function getMilliFactorForScheduleUnit(scheduleUnit) {
  switch (scheduleUnit) {
    case _runtime_types.ScheduleUnit.SECONDS:
      return 1000;
    case _runtime_types.ScheduleUnit.MINUTES:
      return 60 * 1000;
    default:
      throw new Error(`Unit ${scheduleUnit} is not supported`);
  }
}