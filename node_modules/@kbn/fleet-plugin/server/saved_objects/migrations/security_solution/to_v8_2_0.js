"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV820 = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migratePackagePolicyToV820 = packagePolicyDoc => {
  var _packagePolicyDoc$att;
  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) !== 'endpoint') {
    return packagePolicyDoc;
  }
  const updatedPackagePolicyDoc = (0, _lodash.cloneDeep)(packagePolicyDoc);
  const input = updatedPackagePolicyDoc.attributes.inputs[0];
  if (input && input.config) {
    const policy = input.config.policy.value;
    policy.windows.malware.blocklist = policy.windows.malware.mode !== 'off';
    policy.mac.malware.blocklist = policy.mac.malware.mode !== 'off';
    policy.linux.malware.blocklist = policy.linux.malware.mode !== 'off';
    policy.linux.events.session_data = false;
  }
  return updatedPackagePolicyDoc;
};
exports.migratePackagePolicyToV820 = migratePackagePolicyToV820;