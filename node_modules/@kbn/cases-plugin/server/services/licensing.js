"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicensingService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LicensingService {
  constructor(license$, notifyUsage) {
    (0, _defineProperty2.default)(this, "license$", void 0);
    (0, _defineProperty2.default)(this, "_notifyUsage", void 0);
    this.license$ = license$;
    this._notifyUsage = notifyUsage;
  }
  notifyUsage(featureName) {
    this._notifyUsage(featureName);
  }
  async getLicenseInformation() {
    return (0, _rxjs.firstValueFrom)(this.license$);
  }
  async isAtLeast(level) {
    const license = await this.getLicenseInformation();
    return !!license && license.isAvailable && license.isActive && license.hasAtLeast(level);
  }
  async isAtLeastPlatinum() {
    return this.isAtLeast('platinum');
  }
  async isAtLeastGold() {
    return this.isAtLeast('gold');
  }
  async isAtLeastEnterprise() {
    return this.isAtLeast('enterprise');
  }
}
exports.LicensingService = LicensingService;