"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketSize = getBucketSize;
var _moment = _interopRequireDefault(require("moment"));
var _calculate_auto = require("./calculate_auto");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getBucketSize({
  start,
  end,
  numBuckets = 50,
  minBucketSize
}) {
  var _calculateAuto$near$a, _calculateAuto$near;
  const duration = _moment.default.duration(end - start, 'ms');
  const bucketSize = Math.max((_calculateAuto$near$a = (_calculateAuto$near = _calculate_auto.calculateAuto.near(numBuckets, duration)) === null || _calculateAuto$near === void 0 ? void 0 : _calculateAuto$near.asSeconds()) !== null && _calculateAuto$near$a !== void 0 ? _calculateAuto$near$a : 0, minBucketSize || 1);
  return {
    bucketSize,
    intervalString: `${bucketSize}s`
  };
}