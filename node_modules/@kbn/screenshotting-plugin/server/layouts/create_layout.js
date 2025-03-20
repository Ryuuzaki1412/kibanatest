"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLayout = createLayout;
var _errors = require("../../common/errors");
var _canvas_layout = require("./canvas_layout");
var _preserve_layout = require("./preserve_layout");
var _print_layout = require("./print_layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// utility for validating the layout type from user's job params
const LAYOUTS = ['canvas', 'print', 'preserve_layout'];

/**
 * Layout dimensions must be sanitized as they are passed in the args that spawn the
 * Chromium process. Width and height must be int32 value.
 *
 */
const sanitizeLayout = dimensions => {
  const {
    width,
    height
  } = dimensions;
  if (isNaN(width) || isNaN(height)) {
    throw new _errors.InvalidLayoutParametersError(`Invalid layout width or height`);
  }
  return {
    width: Math.round(width),
    height: Math.round(height)
  };
};
function createLayout({
  id,
  dimensions,
  selectors,
  ...config
}) {
  const layoutId = id !== null && id !== void 0 ? id : 'print';
  if (!LAYOUTS.includes(layoutId)) {
    throw new _errors.InvalidLayoutParametersError(`Invalid layout type`);
  }
  if (dimensions) {
    if (layoutId === 'preserve_layout') {
      return new _preserve_layout.PreserveLayout(sanitizeLayout(dimensions), selectors);
    }
    if (layoutId === 'canvas') {
      return new _canvas_layout.CanvasLayout(sanitizeLayout(dimensions));
    }
  }

  // layoutParams is optional as PrintLayout doesn't use it
  return new _print_layout.PrintLayout(config);
}