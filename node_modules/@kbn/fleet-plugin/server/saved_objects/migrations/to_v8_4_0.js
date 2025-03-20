"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV840 = exports.migrateInstallationToV840 = exports.migrateAgentPolicyToV840 = void 0;
var _security_solution = require("./security_solution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateInstallationToV840 = installationDoc => {
  installationDoc.attributes.verification_status = 'unknown';
  return installationDoc;
};
exports.migrateInstallationToV840 = migrateInstallationToV840;
const migrateAgentPolicyToV840 = agentPolicyDoc => {
  agentPolicyDoc.attributes.download_source_id = agentPolicyDoc.attributes.config_id;
  // @ts-expect-error
  delete agentPolicyDoc.attributes.config_id;
  return agentPolicyDoc;
};
exports.migrateAgentPolicyToV840 = migrateAgentPolicyToV840;
const migratePackagePolicyToV840 = (packagePolicyDoc, migrationContext) => {
  var _packagePolicyDoc$att;
  let updatedPackagePolicyDoc = packagePolicyDoc;

  // Endpoint specific migrations
  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    updatedPackagePolicyDoc = (0, _security_solution.migratePackagePolicyToV840)(packagePolicyDoc, migrationContext);
  }
  return updatedPackagePolicyDoc;
};
exports.migratePackagePolicyToV840 = migratePackagePolicyToV840;