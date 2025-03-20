"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScaleOptions = exports.PLUGIN_NAME = exports.PLUGIN_ID = exports.Orientation = exports.EXPRESSION_NAME = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const PLUGIN_ID = 'expressionTagcloud';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'expressionTagcloud';
exports.PLUGIN_NAME = PLUGIN_NAME;
const EXPRESSION_NAME = 'tagcloud';
exports.EXPRESSION_NAME = EXPRESSION_NAME;
const ScaleOptions = {
  LINEAR: 'linear',
  LOG: 'log',
  SQUARE_ROOT: 'square root'
};
exports.ScaleOptions = ScaleOptions;
const Orientation = {
  SINGLE: 'single',
  RIGHT_ANGLED: 'right angled',
  MULTIPLE: 'multiple'
};
exports.Orientation = Orientation;