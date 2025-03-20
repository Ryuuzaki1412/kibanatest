"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeBucketWidthFromTimeRangeAndBucketCount = computeBucketWidthFromTimeRangeAndBucketCount;
exports.createUniformBucketsForTimeRange = createUniformBucketsForTimeRange;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function computeBucketWidthFromTimeRangeAndBucketCount(timeFrom, timeTo, numBuckets) {
  return Math.max(Math.floor((timeTo - timeFrom) / numBuckets), 1);
}

// Given a possibly empty set of timestamps, a time range, and a bucket width,
// we create an increasing list of timestamps that are uniformally spaced and
// cover the given time range.
//
// The smallest timestamp, t0, should match this invariant:
//   timeFrom - bucketWidth < t0 <= timeFrom
//
// The largest timestamp, t1, should match this invariant:
//   timeTo - bucketWidth < t1 <= timeTo
function createUniformBucketsForTimeRange(timestamps, timeFrom, timeTo, bucketWidth) {
  if (timestamps.length > 0) {
    // We only need one arbitrary timestamp to generate the buckets covering
    // the given time range
    const t = timestamps[0];
    const left = t - bucketWidth * Math.ceil((t - timeFrom) / bucketWidth);
    const right = t + bucketWidth * Math.floor((timeTo - t) / bucketWidth);
    return (0, _lodash.range)(left, right + 1, bucketWidth);
  }
  return (0, _lodash.range)(timeFrom, timeTo + 1, bucketWidth);
}