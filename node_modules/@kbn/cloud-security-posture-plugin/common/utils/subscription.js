"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSubscriptionAllowed = void 0;
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MINIMUM_NON_CLOUD_LICENSE_TYPE = 'enterprise';
const isSubscriptionAllowed = (isCloudEnabled, license) => {
  if (isCloudEnabled) {
    return true;
  }
  if (!license) {
    return false;
  }
  const licenseCheck = license.check(_.PLUGIN_NAME, MINIMUM_NON_CLOUD_LICENSE_TYPE);
  return licenseCheck.state === 'valid';
};
exports.isSubscriptionAllowed = isSubscriptionAllowed;