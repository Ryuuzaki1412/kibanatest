"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractTimeFilter = extractTimeFilter;
exports.extractTimeRange = extractTimeRange;
var _lodash = require("lodash");
var _build_filters = require("../build_filters");
var _convert_range_filter = require("./convert_range_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function extractTimeFilter(timeFieldName, filters) {
  const [timeRangeFilter, restOfFilters] = (0, _lodash.partition)(filters, obj => {
    let key;
    if ((0, _build_filters.isRangeFilter)(obj)) {
      key = (0, _lodash.keys)(obj.query.range)[0];
    }
    return Boolean(key && key === timeFieldName);
  });
  return {
    restOfFilters,
    timeRangeFilter: timeRangeFilter[0]
  };
}
function extractTimeRange(filters, timeFieldName) {
  if (!timeFieldName) return {
    restOfFilters: filters,
    timeRange: undefined
  };
  const {
    timeRangeFilter,
    restOfFilters
  } = extractTimeFilter(timeFieldName, filters);
  return {
    restOfFilters,
    timeRange: timeRangeFilter ? (0, _convert_range_filter.convertRangeFilterToTimeRangeString)(timeRangeFilter) : undefined
  };
}