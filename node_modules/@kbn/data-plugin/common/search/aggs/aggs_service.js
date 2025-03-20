"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggsRequiredUiSettings = exports.AggsCommonService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _ = require("../..");
var _2 = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const aggsRequiredUiSettings = ['dateFormat', 'dateFormat:scaled', 'dateFormat:tz', _.UI_SETTINGS.HISTOGRAM_BAR_TARGET, _.UI_SETTINGS.HISTOGRAM_MAX_BARS, _.UI_SETTINGS.SEARCH_QUERY_LANGUAGE, _.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS, _.UI_SETTINGS.QUERY_STRING_OPTIONS, _.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX];
exports.aggsRequiredUiSettings = aggsRequiredUiSettings;
/**
 * The aggs service provides a means of modeling and manipulating the various
 * Elasticsearch aggregations supported by Kibana, providing the ability to
 * output the correct DSL when you are ready to send your request to ES.
 */
class AggsCommonService {
  constructor(aggExecutionContext) {
    (0, _defineProperty2.default)(this, "aggTypesRegistry", new _2.AggTypesRegistry());
    this.aggExecutionContext = aggExecutionContext;
  }
  setup({
    registerFunction
  }) {
    const aggTypesSetup = this.aggTypesRegistry.setup();

    // register each agg type
    const aggTypes = (0, _2.getAggTypes)();
    aggTypes.buckets.forEach(({
      name,
      fn
    }) => aggTypesSetup.registerBucket(name, fn));
    aggTypes.metrics.forEach(({
      name,
      fn
    }) => aggTypesSetup.registerMetric(name, fn));

    // register expression functions for each agg type
    const aggFunctions = (0, _2.getAggTypesFunctions)();
    aggFunctions.forEach(fn => registerFunction(fn));
    return {
      types: aggTypesSetup
    };
  }
  start({
    getConfig,
    fieldFormats,
    calculateBounds
  }) {
    const aggTypesStart = this.aggTypesRegistry.start({
      getConfig,
      getFieldFormatsStart: () => fieldFormats,
      aggExecutionContext: this.aggExecutionContext,
      calculateBounds
    });
    return {
      types: aggTypesStart,
      calculateAutoTimeExpression: (0, _2.getCalculateAutoTimeExpression)(getConfig),
      createAggConfigs: (indexPattern, configStates, options) => new _2.AggConfigs(indexPattern, configStates, {
        ...options,
        typesRegistry: aggTypesStart,
        aggExecutionContext: this.aggExecutionContext
      }, getConfig)
    };
  }
}
exports.AggsCommonService = AggsCommonService;