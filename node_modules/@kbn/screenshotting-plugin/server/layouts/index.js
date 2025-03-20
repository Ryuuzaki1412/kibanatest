"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_SELECTORS = void 0;
Object.defineProperty(exports, "createLayout", {
  enumerable: true,
  get: function () {
    return _create_layout.createLayout;
  }
});
var _create_layout = require("./create_layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_SELECTORS = {
  screenshot: '[data-shared-items-container]',
  renderComplete: '[data-shared-item]',
  renderError: '[data-render-error]',
  renderErrorAttribute: 'data-render-error',
  itemsCountAttribute: 'data-shared-items-count',
  timefilterDurationAttribute: 'data-shared-timefilter-duration'
};
exports.DEFAULT_SELECTORS = DEFAULT_SELECTORS;