"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJourneyFailedSteps = void 0;
var _as_mutable_array = require("../../../../common/utils/as_mutable_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getJourneyFailedSteps = async ({
  uptimeEsClient,
  checkGroups
}) => {
  const params = {
    query: {
      bool: {
        filter: [{
          terms: {
            'synthetics.type': ['step/end']
          }
        }, {
          exists: {
            field: 'synthetics.error'
          }
        }, {
          terms: {
            'monitor.check_group': checkGroups
          }
        }]
      }
    },
    sort: (0, _as_mutable_array.asMutableArray)([{
      'synthetics.step.index': {
        order: 'asc'
      }
    }, {
      '@timestamp': {
        order: 'asc'
      }
    }]),
    _source: {
      excludes: ['synthetics.blob']
    },
    size: 500
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  return result.hits.hits.map(({
    _id,
    _source
  }) => {
    const step = Object.assign({
      _id
    }, _source);
    return {
      ...step,
      timestamp: step['@timestamp']
    };
  });
};
exports.getJourneyFailedSteps = getJourneyFailedSteps;