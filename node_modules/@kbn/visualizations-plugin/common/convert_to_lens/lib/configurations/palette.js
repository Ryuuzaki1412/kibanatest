"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaletteFromStopsWithColors = exports.getPalette = void 0;
var _color = _interopRequireDefault(require("color"));
var _utils = require("../../../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const buildPaletteParams = ({
  color: colors,
  stop
}) => {
  const colorsWithoutStartColor = colors.slice(1, colors.length);
  return {
    rangeMin: stop[0],
    rangeMax: stop[stop.length - 1],
    continuity: 'none',
    colorStops: colorsWithoutStartColor.map((c, index) => ({
      color: (0, _color.default)(c).hex(),
      stop: stop[index]
    })),
    stops: colorsWithoutStartColor.map((c, index) => ({
      color: (0, _color.default)(c).hex(),
      stop: stop[index + 1]
    }))
  };
};
const buildCustomPalette = (colorStopsWithMinMax, isPercentRangeType = false) => {
  return {
    name: 'custom',
    params: {
      maxSteps: 5,
      name: 'custom',
      progression: 'fixed',
      rangeMax: Infinity,
      rangeMin: -Infinity,
      rangeType: isPercentRangeType ? 'percent' : 'number',
      reverse: false,
      ...colorStopsWithMinMax
    },
    type: 'palette'
  };
};
const convertToPercents = (value, {
  min,
  max
}, isPercentPaletteSupported) => {
  const percent = (value - min) / (max - min);
  return isPercentPaletteSupported ? percent * 100 : percent;
};
const convertToPercentColorStops = (colorStops, percentageModeConfig, isPercentPaletteSupported = false) => {
  const stop = colorStops.stop.map(stopValue => convertToPercents(stopValue, percentageModeConfig, isPercentPaletteSupported));
  return {
    ...colorStops,
    stop
  };
};
const getPaletteFromStopsWithColors = (config, percentageModeConfig, isPercentPaletteSupported = false) => {
  const percentStopsWithColors = percentageModeConfig.isPercentageMode ? convertToPercentColorStops(config, percentageModeConfig, isPercentPaletteSupported) : config;
  return buildCustomPalette(buildPaletteParams(percentStopsWithColors), isPercentPaletteSupported && percentageModeConfig.isPercentageMode);
};
exports.getPaletteFromStopsWithColors = getPaletteFromStopsWithColors;
const getPalette = (params, percentageModeConfig, isPercentPaletteSupported = false) => {
  const {
    colorSchema,
    colorsRange,
    invertColors
  } = params;
  if (!(colorsRange && colorsRange.length)) {
    return;
  }
  const stopsWithColors = (0, _utils.getStopsWithColorsFromRanges)(colorsRange, colorSchema, invertColors);
  return getPaletteFromStopsWithColors(stopsWithColors, percentageModeConfig, isPercentPaletteSupported);
};
exports.getPalette = getPalette;