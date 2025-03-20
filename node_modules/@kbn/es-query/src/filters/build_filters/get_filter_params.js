"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterParams = getFilterParams;
var _phrases_filter = require("./phrases_filter");
var _phrase_filter = require("./phrase_filter");
var _range_filter = require("./range_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @internal used only by the filter bar to create filter pills.
 */
function getFilterParams(filter) {
  if ((0, _phrase_filter.isPhraseFilter)(filter)) {
    var _filter$meta$params;
    return (_filter$meta$params = filter.meta.params) === null || _filter$meta$params === void 0 ? void 0 : _filter$meta$params.query;
  } else if ((0, _phrases_filter.isPhrasesFilter)(filter)) {
    return filter.meta.params;
  } else if ((0, _range_filter.isRangeFilter)(filter) && filter.meta.params) {
    const {
      gte,
      gt,
      lte,
      lt
    } = filter.meta.params;
    return {
      from: gte !== null && gte !== void 0 ? gte : gt,
      to: lt !== null && lt !== void 0 ? lt : lte
    };
  } else {
    return filter.meta.params;
  }
}