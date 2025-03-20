"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paletteExpressionFn = void 0;
var _lodash = require("lodash");
var _coloring = require("@kbn/coloring");
var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const paletteExpressionFn = async (input, args) => {
  const {
    color,
    continuity,
    reverse,
    gradient,
    stop,
    range,
    rangeMin,
    rangeMax
  } = args;
  const colors = [].concat(color || _constants.defaultCustomColors);
  const stops = [].concat(stop || []);
  if (stops.length > 0 && colors.length !== stops.length) {
    throw Error('When stop is used, each color must have an associated stop value.');
  }

  // If the user has defined stops, choose rangeMin/Max, provided by user or range,
  // taken from first/last element of ranges or default range (0 or 100).
  const calculateRange = (userRange, stopsRange, defaultRange) => {
    var _ref;
    return (_ref = userRange !== null && userRange !== void 0 ? userRange : stopsRange) !== null && _ref !== void 0 ? _ref : defaultRange;
  };
  const rangeMinDefault = 0;
  const rangeMaxDefault = 100;
  return {
    type: 'palette',
    name: 'custom',
    params: {
      colors: reverse ? colors.reverse() : colors,
      stops,
      range: range !== null && range !== void 0 ? range : 'percent',
      gradient,
      continuity,
      rangeMin: (0, _coloring.checkIsMinContinuity)(continuity) ? Number.NEGATIVE_INFINITY : calculateRange(rangeMin, stops[0], rangeMinDefault),
      rangeMax: (0, _coloring.checkIsMaxContinuity)(continuity) ? Number.POSITIVE_INFINITY : calculateRange(rangeMax, (0, _lodash.last)(stops), rangeMaxDefault)
    }
  };
};
exports.paletteExpressionFn = paletteExpressionFn;