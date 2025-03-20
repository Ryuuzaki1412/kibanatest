"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visDimension = void 0;
var _i18n = require("@kbn/i18n");
var _accessors = require("../utils/accessors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const visDimension = () => ({
  name: 'visdimension',
  help: _i18n.i18n.translate('visualizations.function.visDimension.help', {
    defaultMessage: 'Generates visConfig dimension object'
  }),
  type: 'vis_dimension',
  inputTypes: ['datatable'],
  args: {
    accessor: {
      types: ['string', 'number'],
      aliases: ['_'],
      help: _i18n.i18n.translate('visualizations.function.visDimension.accessor.help', {
        defaultMessage: 'Column in your dataset to use (either column index or column name)'
      })
    },
    format: {
      types: ['string'],
      help: _i18n.i18n.translate('visualizations.function.visDimension.format.help', {
        defaultMessage: 'Format'
      })
    },
    formatParams: {
      types: ['string'],
      help: _i18n.i18n.translate('visualizations.function.visDimension.formatParams.help', {
        defaultMessage: 'Format params'
      })
    }
  },
  fn: (input, args) => {
    const accessor = (0, _accessors.findAccessorOrFail)(args.accessor, input.columns);
    const column = typeof accessor === 'number' ? input.columns[accessor] : accessor;
    const columnFormat = column.meta.params;
    // if a user hasn't specified the format of the column and its format is not specified at the table columns,
    // then the default format id ('string') should be used
    const format = args.format || args.formatParams || !columnFormat ? {
      id: args.format || 'string',
      params: JSON.parse(args.formatParams || '{}')
    } : columnFormat;
    return {
      type: 'vis_dimension',
      accessor,
      format
    };
  }
});
exports.visDimension = visDimension;