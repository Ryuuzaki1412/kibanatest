"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRoundShape = exports.isBulletShape = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const isRoundShape = shape => {
  const roundShapes = [_constants.GaugeShapes.ARC, _constants.GaugeShapes.CIRCLE];
  return roundShapes.includes(shape);
};
exports.isRoundShape = isRoundShape;
const isBulletShape = shape => {
  const bulletShapes = [_constants.GaugeShapes.HORIZONTAL_BULLET, _constants.GaugeShapes.VERTICAL_BULLET];
  return bulletShapes.includes(shape);
};
exports.isBulletShape = isBulletShape;