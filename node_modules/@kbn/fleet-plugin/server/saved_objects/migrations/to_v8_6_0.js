"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateSettingsToV860 = exports.migratePackagePolicyToV860 = exports.migrateInstallationToV860 = void 0;
var _constants = require("../../../common/constants");
var _security_solution = require("./security_solution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateSettingsToV860 = (settingsDoc, migrationContext) => {
  // @ts-expect-error has_seen_fleet_migration_notice property does not exists anymore
  delete settingsDoc.attributes.has_seen_fleet_migration_notice;
  settingsDoc.attributes.prerelease_integrations_enabled = false;
  return settingsDoc;
};
exports.migrateSettingsToV860 = migrateSettingsToV860;
const migrateInstallationToV860 = installationDoc => {
  if (installationDoc.attributes.name === _constants.FLEET_CLOUD_SECURITY_POSTURE_PACKAGE) {
    installationDoc.attributes.keep_policies_up_to_date = true;
  }
  return installationDoc;
};
exports.migrateInstallationToV860 = migrateInstallationToV860;
const migratePackagePolicyToV860 = (packagePolicyDoc, migrationContext) => {
  var _packagePolicyDoc$att;
  let updatedPackagePolicyDoc = packagePolicyDoc;

  // Endpoint specific migrations
  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    updatedPackagePolicyDoc = (0, _security_solution.migratePackagePolicyToV860)(packagePolicyDoc, migrationContext);
  }
  return updatedPackagePolicyDoc;
};
exports.migratePackagePolicyToV860 = migratePackagePolicyToV860;