"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "assetPath", {
  enumerable: true,
  get: function () {
    return _constants.assetPath;
  }
});
exports.tableBorderWidth = exports.subheadingMarginTop = exports.subheadingMarginBottom = exports.subheadingHeight = exports.subheadingFontSize = exports.pageMarginWidth = exports.pageMarginTop = exports.pageMarginBottom = exports.headingMarginTop = exports.headingMarginBottom = exports.headingHeight = exports.headingFontSize = void 0;
var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const tableBorderWidth = 1;
exports.tableBorderWidth = tableBorderWidth;
const pageMarginTop = 40;
exports.pageMarginTop = pageMarginTop;
const pageMarginBottom = 80;
exports.pageMarginBottom = pageMarginBottom;
const pageMarginWidth = 40;
exports.pageMarginWidth = pageMarginWidth;
const headingFontSize = 14;
exports.headingFontSize = headingFontSize;
const headingMarginTop = 10;
exports.headingMarginTop = headingMarginTop;
const headingMarginBottom = 5;
exports.headingMarginBottom = headingMarginBottom;
const headingHeight = headingFontSize * 1.5 + headingMarginTop + headingMarginBottom;
exports.headingHeight = headingHeight;
const subheadingFontSize = 12;
exports.subheadingFontSize = subheadingFontSize;
const subheadingMarginTop = 0;
exports.subheadingMarginTop = subheadingMarginTop;
const subheadingMarginBottom = 5;
exports.subheadingMarginBottom = subheadingMarginBottom;
const subheadingHeight = subheadingFontSize * 1.5 + subheadingMarginTop + subheadingMarginBottom;
exports.subheadingHeight = subheadingHeight;