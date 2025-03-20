"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datatableColumn = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const datatableColumn = {
  name: 'lens_datatable_column',
  aliases: [],
  type: 'lens_datatable_column',
  help: '',
  inputTypes: ['null'],
  args: {
    columnId: {
      types: ['string'],
      help: ''
    },
    alignment: {
      types: ['string'],
      help: ''
    },
    sortingHint: {
      types: ['string'],
      help: ''
    },
    hidden: {
      types: ['boolean'],
      help: ''
    },
    oneClickFilter: {
      types: ['boolean'],
      help: ''
    },
    width: {
      types: ['number'],
      help: ''
    },
    isTransposed: {
      types: ['boolean'],
      help: ''
    },
    transposable: {
      types: ['boolean'],
      help: ''
    },
    colorMode: {
      types: ['string'],
      help: ''
    },
    palette: {
      types: ['palette'],
      help: ''
    },
    summaryRow: {
      types: ['string'],
      help: ''
    },
    summaryLabel: {
      types: ['string'],
      help: ''
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'lens_datatable_column',
      ...args
    };
  }
};
exports.datatableColumn = datatableColumn;