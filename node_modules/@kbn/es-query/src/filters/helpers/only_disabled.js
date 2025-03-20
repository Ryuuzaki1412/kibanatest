"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onlyDisabledFiltersChanged = void 0;
var _lodash = require("lodash");
var _compare_filters = require("./compare_filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const isEnabled = f => f && f.meta && !f.meta.disabled;

/**
 * Checks to see if only disabled filters have been changed
 * @returns {bool} Only disabled filters
 *
 * @public
 */
const onlyDisabledFiltersChanged = (newFilters, oldFilters, comparatorOptions) => {
  // If it's the same - compare only enabled filters
  const newEnabledFilters = (0, _lodash.filter)(newFilters || [], isEnabled);
  const oldEnabledFilters = (0, _lodash.filter)(oldFilters || [], isEnabled);
  const options = comparatorOptions !== null && comparatorOptions !== void 0 ? comparatorOptions : _compare_filters.COMPARE_ALL_OPTIONS;
  return (0, _compare_filters.compareFilters)(oldEnabledFilters, newEnabledFilters, options);
};
exports.onlyDisabledFiltersChanged = onlyDisabledFiltersChanged;