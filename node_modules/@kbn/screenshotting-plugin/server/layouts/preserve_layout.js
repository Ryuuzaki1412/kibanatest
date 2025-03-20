"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PreserveLayout = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path = _interopRequireDefault(require("path"));
var _ = require(".");
var _base_layout = require("./base_layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// We use a zoom of two to bump up the resolution of the screenshot a bit.
const ZOOM = 2;
class PreserveLayout extends _base_layout.BaseLayout {
  constructor(size, selectors) {
    super('preserve_layout');
    (0, _defineProperty2.default)(this, "selectors", void 0);
    (0, _defineProperty2.default)(this, "height", void 0);
    (0, _defineProperty2.default)(this, "width", void 0);
    (0, _defineProperty2.default)(this, "scaledHeight", void 0);
    (0, _defineProperty2.default)(this, "scaledWidth", void 0);
    this.height = size.height;
    this.width = size.width;
    this.scaledHeight = size.height * ZOOM;
    this.scaledWidth = size.width * ZOOM;
    this.selectors = {
      ..._.DEFAULT_SELECTORS,
      ...selectors
    };
  }
  getCssOverridesPath() {
    // TODO: Remove this path once we have migrated all plugins away from depending on this hiding page elements.
    return _path.default.join(__dirname, 'preserve_layout.css');
  }
  getBrowserViewport() {
    return {
      height: this.scaledHeight,
      width: this.scaledWidth
    };
  }
  getBrowserZoom() {
    return ZOOM;
  }
  getViewport() {
    return {
      height: this.height,
      width: this.width,
      zoom: ZOOM
    };
  }
  getPdfImageSize() {
    return {
      height: this.height,
      width: this.width
    };
  }
  getPdfPageOrientation() {
    return undefined;
  }
  getPdfPageSize(pageSizeParams) {
    return {
      height: this.height + pageSizeParams.pageMarginTop + pageSizeParams.pageMarginBottom + pageSizeParams.tableBorderWidth * 2 + pageSizeParams.headingHeight + pageSizeParams.subheadingHeight,
      width: this.width + pageSizeParams.pageMarginWidth * 2 + pageSizeParams.tableBorderWidth * 2
    };
  }
}
exports.PreserveLayout = PreserveLayout;