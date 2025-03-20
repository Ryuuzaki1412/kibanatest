"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inferTimeZone = inferTimeZone;
var _utils = require("../../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function inferTimeZone(params, dataView, aggName, getConfig, {
  shouldDetectTimeZone
} = {}) {
  let tz = params.time_zone;
  if (!tz && params.field) {
    var _dataView$typeMeta, _dataView$typeMeta$ag, _dataView$typeMeta$ag2, _dataView$typeMeta$ag3;
    // If a field has been configured check the index pattern's typeMeta if a date_histogram on that
    // field requires a specific time_zone
    const fieldName = typeof params.field === 'string' ? params.field : params.field.name;
    tz = (_dataView$typeMeta = dataView.typeMeta) === null || _dataView$typeMeta === void 0 ? void 0 : (_dataView$typeMeta$ag = _dataView$typeMeta.aggs) === null || _dataView$typeMeta$ag === void 0 ? void 0 : (_dataView$typeMeta$ag2 = _dataView$typeMeta$ag[aggName]) === null || _dataView$typeMeta$ag2 === void 0 ? void 0 : (_dataView$typeMeta$ag3 = _dataView$typeMeta$ag2[fieldName]) === null || _dataView$typeMeta$ag3 === void 0 ? void 0 : _dataView$typeMeta$ag3.time_zone;
  }
  if (!tz) {
    return (0, _utils.getUserTimeZone)(getConfig, shouldDetectTimeZone);
  }
  return tz;
}