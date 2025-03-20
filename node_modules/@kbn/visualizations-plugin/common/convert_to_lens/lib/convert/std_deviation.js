"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStdDeviationFormula = exports.convertToStdDeviationFormulaColumns = void 0;
var _utils = require("../../utils");
var _formula = require("../metrics/formula");
var _utils2 = require("../utils");
var _formula2 = require("./formula");
var _supported_metrics = require("./supported_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const STD_LOWER = 'std_lower';
const STD_UPPER = 'std_upper';
const STD_MODES = [STD_LOWER, STD_UPPER];
const getFormulaForStdDevLowerBound = (field, reducedTimeRange) => {
  const aggFormula = (0, _supported_metrics.getFormulaFromMetric)(_supported_metrics.SUPPORTED_METRICS.std_dev);
  return `average(${field}${(0, _formula.addTimeRangeToFormula)(reducedTimeRange)}) - ${2} * ${aggFormula}(${field}${(0, _formula.addTimeRangeToFormula)(reducedTimeRange)})`;
};
const getFormulaForStdDevUpperBound = (field, reducedTimeRange) => {
  const aggFormula = (0, _supported_metrics.getFormulaFromMetric)(_supported_metrics.SUPPORTED_METRICS.std_dev);
  return `average(${field}${(0, _formula.addTimeRangeToFormula)(reducedTimeRange)}) + ${2} * ${aggFormula}(${field}${(0, _formula.addTimeRangeToFormula)(reducedTimeRange)})`;
};
const getStdDeviationFormula = (aggId, fieldName, reducedTimeRange) => {
  const [, mode] = aggId.split('.');
  if (!STD_MODES.includes(mode)) {
    return null;
  }
  return mode === STD_LOWER ? getFormulaForStdDevLowerBound(fieldName, reducedTimeRange) : getFormulaForStdDevUpperBound(fieldName, reducedTimeRange);
};
exports.getStdDeviationFormula = getStdDeviationFormula;
const convertToStdDeviationFormulaColumns = ({
  visType,
  agg,
  dataView
}, reducedTimeRange) => {
  var _agg$aggParams;
  const {
    aggId
  } = agg;
  if (!aggId) {
    return null;
  }
  const fieldName = (0, _utils2.getFieldNameFromField)((_agg$aggParams = agg.aggParams) === null || _agg$aggParams === void 0 ? void 0 : _agg$aggParams.field);
  if (!fieldName) {
    return null;
  }
  const field = dataView.getFieldByName(fieldName);
  if (!(0, _utils.isFieldValid)(visType, field, _supported_metrics.SUPPORTED_METRICS[agg.aggType])) {
    return null;
  }
  const formula = getStdDeviationFormula(aggId, field.displayName, reducedTimeRange);
  if (!formula) {
    return null;
  }
  const formulaColumn = (0, _formula2.createFormulaColumn)(formula, agg);
  if (!formulaColumn) {
    return null;
  }
  return {
    ...formulaColumn,
    label: agg.label
  };
};
exports.convertToStdDeviationFormulaColumns = convertToStdDeviationFormulaColumns;