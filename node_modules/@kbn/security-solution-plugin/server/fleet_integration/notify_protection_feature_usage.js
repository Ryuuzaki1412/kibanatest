"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyProtectionFeatureUsage = notifyProtectionFeatureUsage;
var _types = require("../../common/endpoint/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const OS_KEYS = Object.values(_types.PolicyOperatingSystem);
const PROTECTION_KEYS = ['memory_protection', 'behavior_protection'];
function isNewlyEnabled(current, next) {
  if (current === 'off' && (next === 'prevent' || next === 'detect')) {
    return true;
  }
  return false;
}
function notifyProtection(type, featureUsageService) {
  switch (type) {
    case 'ransomware':
      featureUsageService.notifyUsage('RANSOMWARE_PROTECTION');
      return;
    case 'memory_protection':
      featureUsageService.notifyUsage('MEMORY_THREAT_PROTECTION');
      return;
    case 'behavior_protection':
      featureUsageService.notifyUsage('BEHAVIOR_PROTECTION');
  }
}
async function notifyProtectionFeatureUsage(newPackagePolicy, featureUsageService, endpointMetadataService) {
  var _newPackagePolicy$inp, _newPackagePolicy$inp2, _newPackagePolicy$inp3, _newPackagePolicy$inp4, _newPackagePolicy$inp5;
  if (!(newPackagePolicy !== null && newPackagePolicy !== void 0 && newPackagePolicy.id) || !(newPackagePolicy !== null && newPackagePolicy !== void 0 && newPackagePolicy.inputs) || !((_newPackagePolicy$inp = newPackagePolicy.inputs[0]) !== null && _newPackagePolicy$inp !== void 0 && (_newPackagePolicy$inp2 = _newPackagePolicy$inp.config) !== null && _newPackagePolicy$inp2 !== void 0 && (_newPackagePolicy$inp3 = _newPackagePolicy$inp2.policy) !== null && _newPackagePolicy$inp3 !== void 0 && _newPackagePolicy$inp3.value)) {
    return;
  }
  const newPolicyConfig = (_newPackagePolicy$inp4 = newPackagePolicy.inputs[0].config) === null || _newPackagePolicy$inp4 === void 0 ? void 0 : (_newPackagePolicy$inp5 = _newPackagePolicy$inp4.policy) === null || _newPackagePolicy$inp5 === void 0 ? void 0 : _newPackagePolicy$inp5.value;

  // function is only called on policy update, we need to fetch the current policy
  // to compare whether the updated policy is newly enabling protections
  const currentPackagePolicy = await endpointMetadataService.getFleetEndpointPackagePolicy(newPackagePolicy.id);
  const currentPolicyConfig = currentPackagePolicy.inputs[0].config.policy.value;

  // ransomware is windows only
  if (isNewlyEnabled(currentPolicyConfig.windows.ransomware.mode, newPolicyConfig.windows.ransomware.mode)) {
    notifyProtection('ransomware', featureUsageService);
  }
  PROTECTION_KEYS.forEach(protectionKey => {
    // only notify once per protection since protection can't be configured per os
    let notified = false;
    OS_KEYS.forEach(osKey => {
      if (!notified && isNewlyEnabled(currentPolicyConfig[osKey][protectionKey].mode, newPolicyConfig[osKey][protectionKey].mode)) {
        notifyProtection(protectionKey, featureUsageService);
        notified = true;
      }
    });
  });
}