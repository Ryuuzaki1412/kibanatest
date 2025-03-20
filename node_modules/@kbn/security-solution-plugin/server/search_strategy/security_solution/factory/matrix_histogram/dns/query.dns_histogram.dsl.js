"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDnsHistogramQuery = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCountAgg = () => ({
  dns_count: {
    cardinality: {
      field: 'dns.question.registered_domain'
    }
  }
});
const createIncludePTRFilter = isPtrIncluded => isPtrIncluded ? {} : {
  must_not: [{
    term: {
      'dns.question.type': {
        value: 'PTR'
      }
    }
  }]
};
const getHistogramAggregation = ({
  from,
  to
}) => {
  const interval = (0, _build_query.calculateTimeSeriesInterval)(from, to);
  const histogramTimestampField = '@timestamp';
  return {
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
};
const buildDnsHistogramQuery = ({
  defaultIndex,
  filterQuery,
  isPtrIncluded = false,
  stackByField = 'dns.question.registered_domain',
  timerange: {
    from,
    to
  }
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    body: {
      aggregations: {
        ...getCountAgg(),
        dns_name_query_count: {
          terms: {
            field: stackByField,
            order: {
              unique_domains: 'desc'
            },
            size: 10
          },
          aggs: {
            unique_domains: {
              cardinality: {
                field: 'dns.question.name'
              }
            },
            dns_question_name: getHistogramAggregation({
              from,
              to
            })
          }
        }
      },
      query: {
        bool: {
          filter,
          ...createIncludePTRFilter(isPtrIncluded)
        }
      }
    },
    size: 0,
    track_total_hits: false
  };
  return dslQuery;
};
exports.buildDnsHistogramQuery = buildDnsHistogramQuery;