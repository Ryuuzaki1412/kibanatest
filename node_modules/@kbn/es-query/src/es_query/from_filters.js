"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQueryFromFilters = void 0;
exports.filterToQueryDsl = filterToQueryDsl;
var _lodash = require("lodash");
var _migrate_filter = require("./migrate_filter");
var _filter_matches_index = require("./filter_matches_index");
var _filters = require("../filters");
var _from_nested_filter = require("./from_nested_filter");
var _from_combined_filter = require("./from_combined_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Create a filter that can be reversed for filters with negate set
 * @param {boolean} reverse This will reverse the filter. If true then
 *                          anything where negate is set will come
 *                          through otherwise it will filter out
 * @returns {function}
 */
const filterNegate = reverse => filter => {
  if ((0, _lodash.isUndefined)(filter.meta) || (0, _lodash.isUndefined)(filter.meta.negate)) {
    return !reverse;
  }
  return filter.meta && filter.meta.negate === reverse;
};

/**
 * Translate a filter into a query to support es 5+
 * @param  {Object} filter - The filter to translate
 * @return {Object} the query version of that filter
 */
const translateToQuery = filter => {
  return filter.query || filter;
};

/**
 * Options for building query for filters
 */

/**
 * @param filters
 * @param indexPattern
 * @param ignoreFilterIfFieldNotInIndex by default filters that use fields that can't be found in the specified index pattern are not applied. Set this to true if you want to apply them anyway.
 * @returns An EQL query
 *
 * @public
 */
const buildQueryFromFilters = (inputFilters = [], inputDataViews, options = {
  ignoreFilterIfFieldNotInIndex: false
}) => {
  const {
    ignoreFilterIfFieldNotInIndex = false
  } = options;
  const filters = inputFilters.filter(filter => filter && !(0, _filters.isFilterDisabled)(filter));
  const filtersToESQueries = negate => {
    return filters.filter(f => !!f).filter(filterNegate(negate)).filter(filter => {
      var _filter$meta;
      const indexPattern = findIndexPattern(inputDataViews, (_filter$meta = filter.meta) === null || _filter$meta === void 0 ? void 0 : _filter$meta.index);
      return !ignoreFilterIfFieldNotInIndex || (0, _filter_matches_index.filterMatchesIndex)(filter, indexPattern);
    }).map(filter => filterToQueryDsl(filter, inputDataViews, options));
  };
  return {
    must: [],
    filter: filtersToESQueries(false),
    should: [],
    must_not: filtersToESQueries(true)
  };
};
exports.buildQueryFromFilters = buildQueryFromFilters;
function findIndexPattern(inputDataViews, id) {
  var _dataViews$find;
  const dataViews = Array.isArray(inputDataViews) ? inputDataViews : [inputDataViews];
  return (_dataViews$find = dataViews.find(index => (index === null || index === void 0 ? void 0 : index.id) === id)) !== null && _dataViews$find !== void 0 ? _dataViews$find : dataViews[0];
}
function filterToQueryDsl(filter, inputDataViews, options = {}) {
  var _filter$meta2;
  const indexPattern = findIndexPattern(inputDataViews, (_filter$meta2 = filter.meta) === null || _filter$meta2 === void 0 ? void 0 : _filter$meta2.index);
  const migratedFilter = (0, _migrate_filter.migrateFilter)(filter, indexPattern);
  const nestedFilter = (0, _from_nested_filter.fromNestedFilter)(migratedFilter, indexPattern, options);
  const combinedFilter = (0, _from_combined_filter.fromCombinedFilter)(nestedFilter, inputDataViews, options);
  const cleanedFilter = (0, _filters.cleanFilter)(combinedFilter);
  return translateToQuery(cleanedFilter);
}