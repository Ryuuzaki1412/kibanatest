"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV850 = exports.migrateAgentPolicyToV850 = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migratePackagePolicyToV850 = (packagePolicyDoc, migrationContext) => {
  // @ts-expect-error output_id property does not exists anymore
  delete packagePolicyDoc.attributes.output_id;
  return packagePolicyDoc;
};
exports.migratePackagePolicyToV850 = migratePackagePolicyToV850;
const migrateAgentPolicyToV850 = agentPolicyDoc => {
  // @ts-expect-error
  delete agentPolicyDoc.attributes.package_policies;
  return agentPolicyDoc;
};
exports.migrateAgentPolicyToV850 = migrateAgentPolicyToV850;