"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimerange = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _metrics = require("../../../../../common/alerting/metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createTimerange = (interval, aggType, timeframe, lastPeriodEnd) => {
  const to = (0, _moment.default)(timeframe ? timeframe.end : Date.now()).valueOf();

  // Rate aggregations need 5 buckets worth of data
  const minimumBuckets = aggType === _metrics.Aggregators.RATE ? 2 : 1;
  const calculatedFrom = lastPeriodEnd ? lastPeriodEnd - interval : to - interval * minimumBuckets;

  // Use either the timeframe.start when the start is less then calculatedFrom
  // OR use the calculatedFrom
  const from = timeframe && timeframe.start && timeframe.start <= calculatedFrom ? timeframe.start : calculatedFrom;
  return {
    start: from,
    end: to
  };
};
exports.createTimerange = createTimerange;