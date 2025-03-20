"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YAxisModes = exports.XYCurveTypes = exports.SeriesTypes = exports.RANGE_MODES = exports.PartitionChartTypes = exports.OperationsWithSourceField = exports.OperationsWithReferences = exports.Operations = exports.NumberDisplayTypes = exports.LegendDisplayTypes = exports.LayerTypes = exports.GaugeTicksPositions = exports.GaugeShapes = exports.GaugeLabelMajorModes = exports.GaugeColorModes = exports.GaugeCentralMajorModes = exports.FillTypes = exports.CollapseFunctions = exports.CategoryDisplayTypes = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const OperationsWithSourceField = {
  FILTERS: 'filters',
  RANGE: 'range',
  TERMS: 'terms',
  DATE_HISTOGRAM: 'date_histogram',
  MIN: 'min',
  MAX: 'max',
  AVERAGE: 'average',
  SUM: 'sum',
  MEDIAN: 'median',
  STANDARD_DEVIATION: 'standard_deviation',
  UNIQUE_COUNT: 'unique_count',
  PERCENTILE: 'percentile',
  PERCENTILE_RANK: 'percentile_rank',
  COUNT: 'count',
  LAST_VALUE: 'last_value'
};
exports.OperationsWithSourceField = OperationsWithSourceField;
const OperationsWithReferences = {
  CUMULATIVE_SUM: 'cumulative_sum',
  COUNTER_RATE: 'counter_rate',
  DIFFERENCES: 'differences',
  MOVING_AVERAGE: 'moving_average',
  FORMULA: 'formula',
  STATIC_VALUE: 'static_value',
  NORMALIZE_BY_UNIT: 'normalize_by_unit'
};
exports.OperationsWithReferences = OperationsWithReferences;
const Operations = {
  ...OperationsWithSourceField,
  ...OperationsWithReferences
};
exports.Operations = Operations;
const PartitionChartTypes = {
  PIE: 'pie',
  DONUT: 'donut',
  TREEMAP: 'treemap',
  MOSAIC: 'mosaic',
  WAFFLE: 'waffle'
};
exports.PartitionChartTypes = PartitionChartTypes;
const CategoryDisplayTypes = {
  DEFAULT: 'default',
  INSIDE: 'inside',
  HIDE: 'hide'
};
exports.CategoryDisplayTypes = CategoryDisplayTypes;
const NumberDisplayTypes = {
  HIDDEN: 'hidden',
  PERCENT: 'percent',
  VALUE: 'value'
};
exports.NumberDisplayTypes = NumberDisplayTypes;
const LegendDisplayTypes = {
  DEFAULT: 'default',
  SHOW: 'show',
  HIDE: 'hide'
};
exports.LegendDisplayTypes = LegendDisplayTypes;
const LayerTypes = {
  DATA: 'data',
  REFERENCELINE: 'referenceLine',
  ANNOTATIONS: 'annotations'
};
exports.LayerTypes = LayerTypes;
const XYCurveTypes = {
  LINEAR: 'LINEAR',
  CURVE_MONOTONE_X: 'CURVE_MONOTONE_X',
  CURVE_STEP_AFTER: 'CURVE_STEP_AFTER'
};
exports.XYCurveTypes = XYCurveTypes;
const YAxisModes = {
  AUTO: 'auto',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom'
};
exports.YAxisModes = YAxisModes;
const SeriesTypes = {
  BAR: 'bar',
  LINE: 'line',
  AREA: 'area',
  BAR_STACKED: 'bar_stacked',
  AREA_STACKED: 'area_stacked',
  BAR_HORIZONTAL: 'bar_horizontal',
  BAR_PERCENTAGE_STACKED: 'bar_percentage_stacked',
  BAR_HORIZONTAL_STACKED: 'bar_horizontal_stacked',
  AREA_PERCENTAGE_STACKED: 'area_percentage_stacked',
  BAR_HORIZONTAL_PERCENTAGE_STACKED: 'bar_horizontal_percentage_stacked'
};
exports.SeriesTypes = SeriesTypes;
const FillTypes = {
  NONE: 'none',
  ABOVE: 'above',
  BELOW: 'below'
};
exports.FillTypes = FillTypes;
const RANGE_MODES = {
  Range: 'range',
  Histogram: 'histogram'
};
exports.RANGE_MODES = RANGE_MODES;
const GaugeShapes = {
  HORIZONTAL_BULLET: 'horizontalBullet',
  VERTICAL_BULLET: 'verticalBullet',
  ARC: 'arc',
  CIRCLE: 'circle'
};
exports.GaugeShapes = GaugeShapes;
const GaugeTicksPositions = {
  HIDDEN: 'hidden',
  AUTO: 'auto',
  BANDS: 'bands'
};
exports.GaugeTicksPositions = GaugeTicksPositions;
const GaugeLabelMajorModes = {
  AUTO: 'auto',
  CUSTOM: 'custom',
  NONE: 'none'
};
exports.GaugeLabelMajorModes = GaugeLabelMajorModes;
const GaugeCentralMajorModes = {
  AUTO: 'auto',
  CUSTOM: 'custom',
  NONE: 'none'
};
exports.GaugeCentralMajorModes = GaugeCentralMajorModes;
const GaugeColorModes = {
  PALETTE: 'palette',
  NONE: 'none'
};
exports.GaugeColorModes = GaugeColorModes;
const CollapseFunctions = ['sum', 'avg', 'min', 'max'];
exports.CollapseFunctions = CollapseFunctions;