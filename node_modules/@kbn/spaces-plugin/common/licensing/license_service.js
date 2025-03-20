"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesLicenseService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SpacesLicenseService {
  constructor() {
    (0, _defineProperty2.default)(this, "licenseSubscription", void 0);
  }
  setup({
    license$
  }) {
    let rawLicense;
    this.licenseSubscription = license$.subscribe(nextRawLicense => {
      rawLicense = nextRawLicense;
    });
    return {
      license: Object.freeze({
        isEnabled: () => this.isSpacesEnabledFromRawLicense(rawLicense)
      })
    };
  }
  stop() {
    if (this.licenseSubscription) {
      this.licenseSubscription.unsubscribe();
      this.licenseSubscription = undefined;
    }
  }
  isSpacesEnabledFromRawLicense(rawLicense) {
    if (!rawLicense || !rawLicense.isAvailable) {
      return false;
    }
    const licenseCheck = rawLicense.check('spaces', 'basic');
    return licenseCheck.state !== 'unavailable' && licenseCheck.state !== 'invalid';
  }
}
exports.SpacesLicenseService = SpacesLicenseService;