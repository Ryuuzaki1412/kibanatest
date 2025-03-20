"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAccessorOrFail = void 0;
exports.getAccessor = getAccessor;
exports.getColumnByAccessor = exports.getAccessorByDimension = void 0;
exports.getFormatByAccessor = getFormatByAccessor;
exports.isVisDimension = isVisDimension;
exports.validateAccessor = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getAccessorByIndex = (accessor, columns) => columns.length > accessor ? accessor : undefined;
const getAccessorById = (accessor, columns) => columns.find(c => c.id === accessor);
const findAccessorOrFail = (accessor, columns) => {
  const foundAccessor = typeof accessor === 'number' ? getAccessorByIndex(accessor, columns) : getAccessorById(accessor, columns);
  if (foundAccessor === undefined) {
    throw new Error(_i18n.i18n.translate('visualizations.function.findAccessorOrFail.error.accessor', {
      defaultMessage: 'Provided column name or index is invalid: {accessor}',
      values: {
        accessor
      }
    }));
  }
  return foundAccessor;
};
exports.findAccessorOrFail = findAccessorOrFail;
const getAccessorByDimension = (dimension, columns) => {
  if (!isVisDimension(dimension)) {
    return dimension;
  }
  const accessor = dimension.accessor;
  if (typeof accessor === 'number') {
    return columns[accessor].id;
  }
  return accessor.id;
};

// we don't need validate ExpressionValueVisDimension type because
// it was already had validation inside `vis_dimenstion` expression function
exports.getAccessorByDimension = getAccessorByDimension;
const validateAccessor = (accessor, columns) => {
  if (accessor && typeof accessor === 'string') {
    findAccessorOrFail(accessor, columns);
  }
};
exports.validateAccessor = validateAccessor;
function getAccessor(dimension) {
  return typeof dimension === 'string' ? dimension : dimension.accessor;
}
function getFormatByAccessor(dimension, columns, defaultColumnFormat) {
  var _getColumnByAccessor;
  return typeof dimension === 'string' ? ((_getColumnByAccessor = getColumnByAccessor(dimension, columns)) === null || _getColumnByAccessor === void 0 ? void 0 : _getColumnByAccessor.meta.params) || defaultColumnFormat : dimension.format || defaultColumnFormat;
}
const getColumnByAccessor = (accessor, columns = []) => {
  if (typeof accessor === 'string') {
    return columns.find(({
      id
    }) => accessor === id);
  }
  const visDimensionAccessor = accessor.accessor;
  if (typeof visDimensionAccessor === 'number') {
    return columns[visDimensionAccessor];
  }
  return columns.find(({
    id
  }) => visDimensionAccessor.id === id);
};
exports.getColumnByAccessor = getColumnByAccessor;
function isVisDimension(accessor) {
  if (typeof accessor === 'string' || accessor === undefined) {
    return false;
  }
  return true;
}