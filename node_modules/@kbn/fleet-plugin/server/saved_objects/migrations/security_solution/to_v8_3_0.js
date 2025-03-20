"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV830 = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migratePackagePolicyToV830 = packagePolicyDoc => {
  var _packagePolicyDoc$att;
  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) !== 'endpoint') {
    return packagePolicyDoc;
  }
  const updatedPackagePolicyDoc = (0, _lodash.cloneDeep)(packagePolicyDoc);
  const input = updatedPackagePolicyDoc.attributes.inputs[0];
  if (input && input.config) {
    const policy = input.config.policy.value;
    const migratedPolicy = {
      event_filters: {
        default: false
      }
    };
    policy.windows.advanced = policy.windows.advanced ? {
      ...policy.windows.advanced,
      ...migratedPolicy
    } : {
      ...migratedPolicy
    };
    policy.mac.advanced = policy.mac.advanced ? {
      ...policy.mac.advanced,
      ...migratedPolicy
    } : {
      ...migratedPolicy
    };
    policy.linux.advanced = policy.linux.advanced ? {
      ...policy.linux.advanced,
      ...migratedPolicy
    } : {
      ...migratedPolicy
    };
  }
  return updatedPackagePolicyDoc;
};
exports.migratePackagePolicyToV830 = migratePackagePolicyToV830;