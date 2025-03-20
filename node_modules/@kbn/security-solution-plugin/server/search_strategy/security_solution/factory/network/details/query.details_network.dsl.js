"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNetworkDetailsQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAggs = (type, ip) => {
  return {
    [type]: {
      filter: {
        term: {
          [`${type}.ip`]: ip
        }
      },
      aggs: {
        as: {
          filter: {
            exists: {
              field: `${type}.as`
            }
          },
          aggs: {
            results: {
              top_hits: {
                size: 1,
                _source: false,
                fields: [`${type}.as*`, {
                  field: '@timestamp',
                  format: 'strict_date_optional_time'
                }],
                sort: [{
                  '@timestamp': 'desc'
                }]
              }
            }
          }
        },
        geo: {
          filter: {
            exists: {
              field: `${type}.geo`
            }
          },
          aggs: {
            results: {
              top_hits: {
                size: 1,
                _source: false,
                fields: [`${type}.geo*`, {
                  field: '@timestamp',
                  format: 'strict_date_optional_time'
                }],
                sort: [{
                  '@timestamp': 'desc'
                }]
              }
            }
          }
        }
      }
    }
  };
};
const getHostAggs = ip => {
  return {
    host: {
      filter: {
        term: {
          'host.ip': ip
        }
      },
      aggs: {
        results: {
          top_hits: {
            size: 1,
            _source: false,
            fields: ['host*', {
              field: '@timestamp',
              format: 'strict_date_optional_time'
            }],
            sort: [{
              '@timestamp': 'desc'
            }]
          }
        }
      }
    }
  };
};
const buildNetworkDetailsQuery = ({
  defaultIndex,
  ip
}) => {
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    track_total_hits: false,
    body: {
      aggs: {
        ...getAggs('source', ip),
        ...getAggs('destination', ip),
        ...getHostAggs(ip)
      },
      query: {
        bool: {
          should: []
        }
      },
      size: 0,
      _source: false
    }
  };
  return dslQuery;
};
exports.buildNetworkDetailsQuery = buildNetworkDetailsQuery;