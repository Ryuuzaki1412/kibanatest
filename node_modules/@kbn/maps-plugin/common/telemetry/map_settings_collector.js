"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapSettingsCollector = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class MapSettingsCollector {
  constructor(attributes) {
    (0, _defineProperty2.default)(this, "_customIconsCount", 0);
    if (!attributes || !attributes.mapStateJSON) {
      return;
    }
    let mapSettings;
    try {
      const mapState = JSON.parse(attributes.mapStateJSON);
      mapSettings = mapState.settings;
    } catch (e) {
      return;
    }
    if (!mapSettings) {
      return;
    }
    if (mapSettings.customIcons) {
      this._customIconsCount = mapSettings.customIcons.length;
    }
  }
  getCustomIconsCount() {
    return this._customIconsCount;
  }
}
exports.MapSettingsCollector = MapSettingsCollector;