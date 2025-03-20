"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV840 = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migratePackagePolicyToV840 = packagePolicyDoc => {
  var _packagePolicyDoc$att;
  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) !== 'endpoint') {
    return packagePolicyDoc;
  }
  const updatedPackagePolicyDoc = (0, _lodash.cloneDeep)(packagePolicyDoc);
  const input = updatedPackagePolicyDoc.attributes.inputs[0];
  if (input && input.config) {
    const policy = input.config.policy.value;
    const migratedAdvancedPolicy = {
      fanotify: {
        ignore_unknown_filesystems: false
      }
    };
    const migratedAttackSurfaceReductionPolicy = {
      credential_hardening: {
        enabled: false
      }
    };
    policy.linux.advanced = policy.linux.advanced ? {
      ...policy.linux.advanced,
      ...migratedAdvancedPolicy
    } : {
      ...migratedAdvancedPolicy
    };
    policy.windows.attack_surface_reduction = migratedAttackSurfaceReductionPolicy;
  }
  return updatedPackagePolicyDoc;
};
exports.migratePackagePolicyToV840 = migratePackagePolicyToV840;