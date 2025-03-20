"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromCombinedFilter = void 0;
var _filters = require("../filters");
var _from_filters = require("./from_filters");
var _build_filters = require("../filters/build_filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const fromAndFilter = (filter, dataViews, options = {}) => {
  const bool = (0, _from_filters.buildQueryFromFilters)(filter.meta.params, dataViews, options);
  return {
    ...filter,
    query: {
      bool
    }
  };
};
const fromOrFilter = (filter, dataViews, options = {}) => {
  const should = filter.meta.params.map(subFilter => ({
    bool: (0, _from_filters.buildQueryFromFilters)([subFilter], dataViews, options)
  }));
  const bool = {
    should,
    minimum_should_match: 1
  };
  return {
    ...filter,
    query: {
      bool
    }
  };
};
const fromCombinedFilter = (filter, dataViews, options = {}) => {
  if (!(0, _filters.isCombinedFilter)(filter)) {
    return filter;
  }
  if (filter.meta.relation === _build_filters.BooleanRelation.AND) {
    return fromAndFilter(filter, dataViews, options);
  }
  return fromOrFilter(filter, dataViews, options);
};
exports.fromCombinedFilter = fromCombinedFilter;