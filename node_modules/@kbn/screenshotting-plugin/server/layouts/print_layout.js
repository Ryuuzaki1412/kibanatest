"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrintLayoutSelectors = exports.PrintLayout = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _ = require(".");
var _browsers = require("../browsers");
var _base_layout = require("./base_layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPrintLayoutSelectors = () => ({
  ..._.DEFAULT_SELECTORS,
  screenshot: '[data-shared-item]' // override '[data-shared-items-container]'
});
exports.getPrintLayoutSelectors = getPrintLayoutSelectors;
class PrintLayout extends _base_layout.BaseLayout {
  constructor({
    zoom = 1
  }) {
    super('print');
    (0, _defineProperty2.default)(this, "selectors", getPrintLayoutSelectors());
    (0, _defineProperty2.default)(this, "viewport", _browsers.DEFAULT_VIEWPORT);
    (0, _defineProperty2.default)(this, "zoom", void 0);
    this.zoom = zoom;
  }
  getCssOverridesPath() {
    return undefined;
  }
  getBrowserViewport() {
    return this.viewport;
  }
  getBrowserZoom() {
    return this.zoom;
  }
  getViewport(itemsCount = 1) {
    return {
      zoom: this.zoom,
      width: this.viewport.width,
      height: this.viewport.height * itemsCount
    };
  }
  getPdfImageSize() {
    return {
      width: 500
    };
  }
  getPdfPageOrientation() {
    return 'portrait';
  }
  getPdfPageSize() {
    return 'A4';
  }
}
exports.PrintLayout = PrintLayout;