"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapRouteWithLicenseCheck = wrapRouteWithLicenseCheck;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function wrapRouteWithLicenseCheck(checkLicense, handler) {
  return async (context, request, response) => {
    const {
      license
    } = await context.licensing;
    const licenseCheckResult = checkLicense(license);
    if (licenseCheckResult.valid) {
      return handler(context, request, response);
    } else {
      return response.forbidden({
        body: licenseCheckResult.message
      });
    }
  };
}