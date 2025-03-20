"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertRangeFilterToTimeRange = convertRangeFilterToTimeRange;
exports.convertRangeFilterToTimeRangeString = convertRangeFilterToTimeRangeString;
var _moment = _interopRequireDefault(require("moment"));
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function convertRangeFilterToTimeRange(filter) {
  const key = (0, _lodash.keys)(filter.query.range)[0];
  const values = filter.query.range[key];
  return {
    from: (0, _moment.default)(values.gt || values.gte),
    to: (0, _moment.default)(values.lt || values.lte)
  };
}
function convertRangeFilterToTimeRangeString(filter) {
  const {
    from,
    to
  } = convertRangeFilterToTimeRange(filter);
  return {
    from: from === null || from === void 0 ? void 0 : from.toISOString(),
    to: to === null || to === void 0 ? void 0 : to.toISOString()
  };
}