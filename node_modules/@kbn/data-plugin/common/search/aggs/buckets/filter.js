"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterBucketAgg = void 0;
var _lodash = require("lodash");
var _i18n = require("@kbn/i18n");
var _esQuery = require("@kbn/es-query");
var _moment = _interopRequireDefault(require("moment"));
var _expressions = require("../../expressions");
var _bucket_agg_type = require("./bucket_agg_type");
var _bucket_agg_types = require("./bucket_agg_types");
var _filter_fn = require("./filter_fn");
var _es_query = require("../../../es_query");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const filterTitle = _i18n.i18n.translate('data.search.aggs.buckets.filterTitle', {
  defaultMessage: 'Filter'
});
const getFilterBucketAgg = ({
  getConfig,
  calculateBounds
}) => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.FILTER,
  expressionName: _filter_fn.aggFilterFnName,
  title: filterTitle,
  makeLabel: () => filterTitle,
  params: [{
    name: 'geo_bounding_box',
    toExpressionAst: _expressions.geoBoundingBoxToAst
  }, {
    name: 'timeShift',
    type: 'string',
    write: () => {}
  }, {
    name: 'timeWindow',
    write: () => {}
  }, {
    name: 'filter',
    write(aggConfig, output, aggConfigs) {
      const filter = aggConfig.params.filter;
      const timeWindow = aggConfig.params.timeWindow;
      const input = (0, _lodash.cloneDeep)(filter);
      if (!input && !timeWindow) {
        return;
      }
      if (!aggConfigs) {
        return;
      }
      let query;
      if (input) {
        const esQueryConfigs = (0, _es_query.getEsQueryConfig)({
          get: getConfig
        });
        query = (0, _esQuery.buildEsQuery)(aggConfig.getIndexPattern(), [input], [], esQueryConfigs);
        if (!query) {
          console.log('malformed filter agg params, missing "query" on input'); // eslint-disable-line no-console
          return;
        }
      }
      const timeRangeAnchor = aggConfigs.timeRange ? (0, _moment.default)(calculateBounds(aggConfigs.timeRange).max) : undefined;
      output.params = !timeWindow || !timeRangeAnchor || !aggConfig.getIndexPattern().timeFieldName ? query : {
        bool: {
          filter: [{
            range: {
              [aggConfig.getIndexPattern().timeFieldName]: {
                format: 'strict_date_optional_time',
                gte: timeRangeAnchor.clone().subtract((0, _utils.parseInterval)(timeWindow)).subtract(aggConfig.getTimeShift()).toISOString(),
                lte: timeRangeAnchor.clone().subtract(aggConfig.getTimeShift()).toISOString()
              }
            }
          }, query ? query : undefined].filter(Boolean)
        }
      };
    },
    toExpressionAst: _expressions.queryToAst
  }]
});
exports.getFilterBucketAgg = getFilterBucketAgg;