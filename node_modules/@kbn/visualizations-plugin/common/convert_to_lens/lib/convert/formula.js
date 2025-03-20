"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFormulaColumn = void 0;
var _column = require("./column");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const convertToFormulaParams = formula => ({
  formula
});
const createFormulaColumn = (formula, agg) => {
  var _agg$aggParams;
  const params = convertToFormulaParams(formula);
  return {
    operationType: 'formula',
    ...(0, _column.createColumn)(agg),
    references: [],
    dataType: 'number',
    params: {
      ...params,
      ...(0, _column.getFormat)()
    },
    timeShift: (_agg$aggParams = agg.aggParams) === null || _agg$aggParams === void 0 ? void 0 : _agg$aggParams.timeShift,
    meta: {
      aggId: (0, _column.createAggregationId)(agg)
    }
  };
};
exports.createFormulaColumn = createFormulaColumn;