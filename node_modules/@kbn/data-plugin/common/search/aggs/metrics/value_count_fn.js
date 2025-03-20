"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggValueCountFnName = exports.aggValueCount = void 0;
var _i18n = require("@kbn/i18n");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const aggValueCountFnName = 'aggValueCount';
exports.aggValueCountFnName = aggValueCountFnName;
const aggValueCount = () => ({
  name: aggValueCountFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.valueCount.help', {
    defaultMessage: 'Generates a serialized agg config for a value count agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.value_count.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.value_count.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.value_count.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.value_count.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.value_count.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.value_count.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    },
    timeShift: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.timeShift.help', {
        defaultMessage: 'Shift the time range for the metric by a set time, for example 1h or 7d. "previous" will use the closest time range from the date histogram or time range filter.'
      })
    },
    emptyAsNull: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.emptyAsNull.help', {
        defaultMessage: 'If set to true, a missing value is treated as null in the resulting data table. If set to false, a "zero" is filled in'
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
        type: _.METRIC_TYPES.VALUE_COUNT,
        params: {
          ...rest
        }
      }
    };
  }
});
exports.aggValueCount = aggValueCount;