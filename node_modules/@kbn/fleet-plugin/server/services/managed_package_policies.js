"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgradeManagedPackagePolicies = void 0;
var _lt = _interopRequireDefault(require("semver/functions/lt"));
var _constants = require("../constants");
var _app_context = require("./app_context");
var _packages = require("./epm/packages");
var _package_policy = require("./package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Upgrade any package policies for packages installed through setup that are denoted as `AUTO_UPGRADE` packages
 * or have the `keep_policies_up_to_date` flag set to `true`
 */
const upgradeManagedPackagePolicies = async (soClient, esClient) => {
  _app_context.appContextService.getLogger().debug('Running required package policies upgrades for managed policies');
  const results = [];
  const installedPackages = await (0, _packages.getInstallations)(soClient, {
    filter: `${_constants.PACKAGES_SAVED_OBJECT_TYPE}.attributes.install_status:installed AND ${_constants.PACKAGES_SAVED_OBJECT_TYPE}.attributes.keep_policies_up_to_date:true`
  });
  for (const {
    attributes: installedPackage
  } of installedPackages.saved_objects) {
    const packagePolicies = await getPackagePoliciesNotMatchingVersion(soClient, installedPackage.name, installedPackage.version);
    for (const packagePolicy of packagePolicies) {
      if (isPolicyVersionLtInstalledVersion(packagePolicy, installedPackage)) {
        await upgradePackagePolicy(soClient, esClient, packagePolicy, installedPackage, results);
      }
    }
  }
  return results;
};
exports.upgradeManagedPackagePolicies = upgradeManagedPackagePolicies;
async function getPackagePoliciesNotMatchingVersion(soClient, pkgName, pkgVersion) {
  return (await _package_policy.packagePolicyService.list(soClient, {
    page: 1,
    perPage: 1000,
    kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${pkgName} AND NOT ${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.version:${pkgVersion}`
  })).items;
}
function isPolicyVersionLtInstalledVersion(packagePolicy, installedPackage) {
  return packagePolicy.package !== undefined && (0, _lt.default)(packagePolicy.package.version, installedPackage.version);
}
async function upgradePackagePolicy(soClient, esClient, packagePolicy, installedPackage, results) {
  // Since upgrades don't report diffs/errors, we need to perform a dry run first in order
  // to notify the user of any granular policy upgrade errors that occur during Fleet's
  // preconfiguration check
  const dryRunResults = await _package_policy.packagePolicyService.getUpgradeDryRunDiff(soClient, packagePolicy.id, packagePolicy, installedPackage.version);
  if (dryRunResults.hasErrors) {
    var _dryRunResults$diff, _dryRunResults$body;
    const errors = dryRunResults.diff ? (_dryRunResults$diff = dryRunResults.diff) === null || _dryRunResults$diff === void 0 ? void 0 : _dryRunResults$diff[1].errors : [(_dryRunResults$body = dryRunResults.body) === null || _dryRunResults$body === void 0 ? void 0 : _dryRunResults$body.message];
    _app_context.appContextService.getLogger().error(new Error(`Error upgrading package policy ${packagePolicy.id}: ${JSON.stringify(errors)}`));
    results.push({
      packagePolicyId: packagePolicy.id,
      diff: dryRunResults.diff,
      errors
    });
    return;
  }
  try {
    await _package_policy.packagePolicyService.upgrade(soClient, esClient, [packagePolicy.id], {
      force: true
    }, packagePolicy, installedPackage.version);
    results.push({
      packagePolicyId: packagePolicy.id,
      diff: dryRunResults.diff,
      errors: []
    });
  } catch (error) {
    results.push({
      packagePolicyId: packagePolicy.id,
      diff: dryRunResults.diff,
      errors: [error]
    });
  }
}