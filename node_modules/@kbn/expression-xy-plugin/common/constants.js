"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Y_AXIS_CONFIG = exports.YScaleTypes = exports.YAxisModes = exports.X_AXIS_CONFIG = exports.XY_VIS_RENDERER = exports.XY_VIS = exports.XYCurveTypes = exports.XScaleTypes = exports.ValueLabelModes = exports.SeriesTypes = exports.REFERENCE_LINE_LAYER = exports.REFERENCE_LINE_DECORATION_CONFIG = exports.REFERENCE_LINE = exports.LineStyles = exports.LayerTypes = exports.LEGEND_CONFIG = exports.LAYERED_XY_VIS = exports.IconPositions = exports.FittingFunctions = exports.FillStyles = exports.EndValues = exports.EXTENDED_REFERENCE_LINE_DECORATION_CONFIG = exports.EXTENDED_DATA_LAYER = exports.EXTENDED_ANNOTATION_LAYER = exports.DATA_LAYER = exports.DATA_DECORATION_CONFIG = exports.AxisModes = exports.AxisExtentModes = exports.AvailableReferenceLineIcons = exports.AXIS_EXTENT_CONFIG = exports.ANNOTATION_LAYER = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const XY_VIS = 'xyVis';
exports.XY_VIS = XY_VIS;
const LAYERED_XY_VIS = 'layeredXyVis';
exports.LAYERED_XY_VIS = LAYERED_XY_VIS;
const DATA_DECORATION_CONFIG = 'dataDecorationConfig';
exports.DATA_DECORATION_CONFIG = DATA_DECORATION_CONFIG;
const REFERENCE_LINE_DECORATION_CONFIG = 'referenceLineDecorationConfig';
exports.REFERENCE_LINE_DECORATION_CONFIG = REFERENCE_LINE_DECORATION_CONFIG;
const EXTENDED_REFERENCE_LINE_DECORATION_CONFIG = 'extendedReferenceLineDecorationConfig';
exports.EXTENDED_REFERENCE_LINE_DECORATION_CONFIG = EXTENDED_REFERENCE_LINE_DECORATION_CONFIG;
const X_AXIS_CONFIG = 'xAxisConfig';
exports.X_AXIS_CONFIG = X_AXIS_CONFIG;
const Y_AXIS_CONFIG = 'yAxisConfig';
exports.Y_AXIS_CONFIG = Y_AXIS_CONFIG;
const DATA_LAYER = 'dataLayer';
exports.DATA_LAYER = DATA_LAYER;
const EXTENDED_DATA_LAYER = 'extendedDataLayer';
exports.EXTENDED_DATA_LAYER = EXTENDED_DATA_LAYER;
const LEGEND_CONFIG = 'legendConfig';
exports.LEGEND_CONFIG = LEGEND_CONFIG;
const XY_VIS_RENDERER = 'xyVis';
exports.XY_VIS_RENDERER = XY_VIS_RENDERER;
const ANNOTATION_LAYER = 'annotationLayer';
exports.ANNOTATION_LAYER = ANNOTATION_LAYER;
const EXTENDED_ANNOTATION_LAYER = 'extendedAnnotationLayer';
exports.EXTENDED_ANNOTATION_LAYER = EXTENDED_ANNOTATION_LAYER;
const AXIS_EXTENT_CONFIG = 'axisExtentConfig';
exports.AXIS_EXTENT_CONFIG = AXIS_EXTENT_CONFIG;
const REFERENCE_LINE = 'referenceLine';
exports.REFERENCE_LINE = REFERENCE_LINE;
const REFERENCE_LINE_LAYER = 'referenceLineLayer';
exports.REFERENCE_LINE_LAYER = REFERENCE_LINE_LAYER;
const LayerTypes = {
  DATA: 'data',
  REFERENCELINE: 'referenceLine',
  ANNOTATIONS: 'annotations'
};
exports.LayerTypes = LayerTypes;
const FittingFunctions = {
  NONE: 'None',
  ZERO: 'Zero',
  LINEAR: 'Linear',
  CARRY: 'Carry',
  LOOKAHEAD: 'Lookahead',
  AVERAGE: 'Average',
  NEAREST: 'Nearest'
};
exports.FittingFunctions = FittingFunctions;
const EndValues = {
  NONE: 'None',
  ZERO: 'Zero',
  NEAREST: 'Nearest'
};
exports.EndValues = EndValues;
const YAxisModes = {
  AUTO: 'auto',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom'
};
exports.YAxisModes = YAxisModes;
const AxisExtentModes = {
  FULL: 'full',
  CUSTOM: 'custom',
  DATA_BOUNDS: 'dataBounds'
};
exports.AxisExtentModes = AxisExtentModes;
const LineStyles = {
  SOLID: 'solid',
  DASHED: 'dashed',
  DOTTED: 'dotted',
  DOT_DASHED: 'dot-dashed'
};
exports.LineStyles = LineStyles;
const FillStyles = {
  NONE: 'none',
  ABOVE: 'above',
  BELOW: 'below'
};
exports.FillStyles = FillStyles;
const IconPositions = {
  AUTO: 'auto',
  LEFT: 'left',
  RIGHT: 'right',
  ABOVE: 'above',
  BELOW: 'below'
};
exports.IconPositions = IconPositions;
const SeriesTypes = {
  BAR: 'bar',
  LINE: 'line',
  AREA: 'area'
};
exports.SeriesTypes = SeriesTypes;
const YScaleTypes = {
  TIME: 'time',
  LINEAR: 'linear',
  LOG: 'log',
  SQRT: 'sqrt'
};
exports.YScaleTypes = YScaleTypes;
const XScaleTypes = {
  TIME: 'time',
  LINEAR: 'linear',
  ORDINAL: 'ordinal'
};
exports.XScaleTypes = XScaleTypes;
const XYCurveTypes = {
  LINEAR: 'LINEAR',
  CURVE_MONOTONE_X: 'CURVE_MONOTONE_X',
  CURVE_STEP_AFTER: 'CURVE_STEP_AFTER'
};
exports.XYCurveTypes = XYCurveTypes;
const ValueLabelModes = {
  HIDE: 'hide',
  SHOW: 'show'
};
exports.ValueLabelModes = ValueLabelModes;
const AvailableReferenceLineIcons = {
  EMPTY: 'empty',
  ASTERISK: 'asterisk',
  ALERT: 'alert',
  BELL: 'bell',
  BOLT: 'bolt',
  BUG: 'bug',
  CIRCLE: 'circle',
  EDITOR_COMMENT: 'editorComment',
  FLAG: 'flag',
  HEART: 'heart',
  MAP_MARKER: 'mapMarker',
  PIN_FILLED: 'pinFilled',
  STAR_EMPTY: 'starEmpty',
  STAR_FILLED: 'starFilled',
  TAG: 'tag',
  TRIANGLE: 'triangle'
};
exports.AvailableReferenceLineIcons = AvailableReferenceLineIcons;
const AxisModes = {
  NORMAL: 'normal',
  PERCENTAGE: 'percentage',
  WIGGLE: 'wiggle',
  SILHOUETTE: 'silhouette'
};
exports.AxisModes = AxisModes;