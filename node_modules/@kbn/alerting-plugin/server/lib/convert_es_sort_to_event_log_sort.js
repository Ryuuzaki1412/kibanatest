"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertEsSortToEventLogSort = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getFormattedSort = sort => {
  if (typeof sort === 'string') {
    throw Error(`Invalid sort type - sort must contain sort field and sort order`);
  }
  const sortField = Object.keys(sort)[0];
  const sortOrder = sort[sortField];
  if (!sortOrder || !sortOrder.order) {
    throw Error(`Invalid sort order type - sortOrder object must contain an 'order' property`);
  }
  return {
    sort_field: sortField,
    sort_order: sortOrder.order
  };
};

/**
 * This helper function converts esSort:
 *
 * {
 *    field: {
 *      order: 'asc'
 *    }
 * }
 *
 * Into event logger sort:
 *
 * [{
 *    sort_field: field,
 *    sort_order: 'asc',
 * }]
 */

const convertEsSortToEventLogSort = esSort => {
  if (!esSort) {
    return;
  }
  if (!Array.isArray(esSort)) {
    return [getFormattedSort(esSort)];
  }
  return esSort.map(sort => getFormattedSort(sort));
};
exports.convertEsSortToEventLogSort = convertEsSortToEventLogSort;