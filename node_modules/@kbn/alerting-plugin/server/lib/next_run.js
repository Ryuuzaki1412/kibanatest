"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextRun = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNextRun = ({
  startDate,
  interval
}) => {
  return (0, _moment.default)(startDate || new Date()).add((0, _common.parseDuration)(interval), 'ms').toISOString();
};
exports.getNextRun = getNextRun;