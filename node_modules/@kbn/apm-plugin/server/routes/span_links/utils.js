"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBufferedTimerange = getBufferedTimerange;
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getBufferedTimerange({
  start,
  end,
  bufferSize = 4
}) {
  return {
    startWithBuffer: (0, _moment.default)(start).subtract(bufferSize, 'days').valueOf(),
    endWithBuffer: (0, _moment.default)(end).add(bufferSize, 'days').valueOf()
  };
}