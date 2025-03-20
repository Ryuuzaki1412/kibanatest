"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQuery = void 0;
var _build_query = require("../../../../../../utils/build_query");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildQuery = ({
  filterQuery,
  stackByField,
  timerange: {
    from,
    to
  },
  pagination: {
    querySize
  },
  defaultIndex
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    term: {
      'event.category': 'authentication'
    }
  }, {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const queryFields = _helpers.authenticationsFields.filter(field => field !== 'timestamp');
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    body: {
      aggregations: {
        stack_by_count: {
          cardinality: {
            field: stackByField
          }
        },
        stack_by: {
          terms: {
            size: querySize,
            field: stackByField,
            order: [{
              'successes.doc_count': 'desc'
            }, {
              'failures.doc_count': 'desc'
            }]
          },
          aggs: {
            failures: {
              filter: {
                term: {
                  'event.outcome': 'failure'
                }
              },
              aggs: {
                lastFailure: {
                  top_hits: {
                    size: 1,
                    _source: false,
                    sort: [{
                      '@timestamp': {
                        order: 'desc'
                      }
                    }]
                  }
                }
              }
            },
            successes: {
              filter: {
                term: {
                  'event.outcome': 'success'
                }
              },
              aggs: {
                lastSuccess: {
                  top_hits: {
                    size: 1,
                    _source: false,
                    sort: [{
                      '@timestamp': {
                        order: 'desc'
                      }
                    }]
                  }
                }
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      size: 0,
      _source: false,
      fields: [...queryFields, {
        field: '@timestamp',
        format: 'strict_date_optional_time'
      }]
    },
    track_total_hits: false
  };
  return dslQuery;
};
exports.buildQuery = buildQuery;