"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggSinglePercentileRankFnName = exports.aggSinglePercentileRank = void 0;
var _i18n = require("@kbn/i18n");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const aggSinglePercentileRankFnName = 'aggSinglePercentileRank';
exports.aggSinglePercentileRankFnName = aggSinglePercentileRankFnName;
const aggSinglePercentileRank = () => ({
  name: aggSinglePercentileRankFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.singlePercentileRank.help', {
    defaultMessage: 'Generates a serialized agg config for a single percentile rank agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRank.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRank.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRank.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRank.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    value: {
      types: ['number'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRank.value.help', {
        defaultMessage: 'Percentile rank value to fetch'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRank.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRank.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    },
    timeShift: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.timeShift.help', {
        defaultMessage: 'Shift the time range for the metric by a set time, for example 1h or 7d. "previous" will use the closest time range from the date histogram or time range filter.'
      })
    }
  },
  fn: (input, args) => {
    const {
      id,
      enabled,
      schema,
      ...rest
    } = args;
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _.METRIC_TYPES.SINGLE_PERCENTILE_RANK,
        params: {
          ...rest
        }
      }
    };
  }
});
exports.aggSinglePercentileRank = aggSinglePercentileRank;