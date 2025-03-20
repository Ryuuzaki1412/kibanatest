"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildPreviewHistogramQuery = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildPreviewHistogramQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex,
  stackByField
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      [_ruleDataUtils.TIMESTAMP]: {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const getHistogramAggregation = () => {
    const interval = (0, _build_query.calculateTimeSeriesInterval)(from, to);
    const histogramTimestampField = _ruleDataUtils.TIMESTAMP;
    const dateHistogram = {
      date_histogram: {
        field: histogramTimestampField,
        fixed_interval: interval,
        min_doc_count: 0,
        extended_bounds: {
          min: (0, _moment.default)(from).valueOf(),
          max: (0, _moment.default)(to).valueOf()
        }
      }
    };
    return {
      preview: {
        terms: {
          field: stackByField,
          missing: 'All others',
          order: {
            _count: 'desc'
          },
          size: 10
        },
        aggs: {
          preview: dateHistogram
        }
      }
    };
  };
  const dslQuery = {
    index: defaultIndex,
    allow_no_indices: true,
    ignore_unavailable: true,
    track_total_hits: true,
    body: {
      aggregations: getHistogramAggregation(),
      query: {
        bool: {
          filter
        }
      },
      size: 0
    }
  };
  return dslQuery;
};
exports.buildPreviewHistogramQuery = buildPreviewHistogramQuery;