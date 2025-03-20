"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPercentageColumnFormulaColumn = void 0;
var _convert = require("../convert");
var _formula = require("./formula");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getPercentageColumnFormulaColumn = ({
  agg,
  aggs,
  dataView,
  visType
}) => {
  const metricFormula = (0, _formula.getFormulaForAgg)({
    agg,
    aggs,
    dataView,
    visType
  });
  if (!metricFormula) {
    return null;
  }
  const formula = `(${metricFormula}) / overall_sum(${metricFormula})`;
  const formulaColumn = (0, _convert.createFormulaColumn)(formula, agg);
  if (!formulaColumn) {
    return null;
  }
  return {
    ...formulaColumn,
    params: {
      ...formulaColumn.params,
      format: {
        id: 'percent'
      }
    },
    label: `${formulaColumn === null || formulaColumn === void 0 ? void 0 : formulaColumn.label} percentages`
  };
};
exports.getPercentageColumnFormulaColumn = getPercentageColumnFormulaColumn;