"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterval = getInterval;
var _moment = _interopRequireDefault(require("moment"));
var _constants = require("../../../common/constants");
var _validate_interval = require("../../../common/validate_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getInterval(timeField, panel, index, {
  min,
  max,
  maxBuckets
}, series) {
  let interval = panel.interval;
  let maxBars = panel.max_bars;
  if (series !== null && series !== void 0 && series.override_index_pattern) {
    interval = series.series_interval || _constants.AUTO_INTERVAL;
    maxBars = series.series_max_bars;
  }
  (0, _validate_interval.validateInterval)({
    min: _moment.default.utc(min),
    max: _moment.default.utc(max)
  }, interval, maxBuckets);
  return {
    maxBars,
    interval: interval || _constants.AUTO_INTERVAL
  };
}