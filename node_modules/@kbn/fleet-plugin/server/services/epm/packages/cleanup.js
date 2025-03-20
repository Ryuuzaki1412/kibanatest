"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeOldAssets = removeOldAssets;
var _storage = require("../archive/storage");
var _common = require("../../../../common");
var _package_policy = require("../../package_policy");
var _ = require("../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function removeOldAssets(options) {
  var _package_assets, _packageAssetRefsRes$, _packageAssetRefsRes$2, _packageAssetRefsRes$3;
  const {
    soClient,
    pkgName,
    currentVersion
  } = options;

  // find all assets of older versions
  const aggs = {
    versions: {
      terms: {
        field: `${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_version`
      }
    }
  };
  const oldVersionsAgg = await soClient.find({
    type: _common.ASSETS_SAVED_OBJECT_TYPE,
    filter: `${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_name:${pkgName} AND ${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_version<${currentVersion}`,
    aggs,
    page: 0,
    perPage: 0
  });
  const oldVersions = oldVersionsAgg.aggregations.versions.buckets.map(obj => obj.key);
  const packageAssetRefsRes = await soClient.find({
    type: _common.PACKAGES_SAVED_OBJECT_TYPE,
    filter: `${_common.PACKAGES_SAVED_OBJECT_TYPE}.attributes.name:${pkgName}`,
    fields: [`${_common.PACKAGES_SAVED_OBJECT_TYPE}.package_assets`]
  });
  const packageAssetRefs = ((_package_assets = (_packageAssetRefsRes$ = packageAssetRefsRes.saved_objects) === null || _packageAssetRefsRes$ === void 0 ? void 0 : (_packageAssetRefsRes$2 = _packageAssetRefsRes$[0]) === null || _packageAssetRefsRes$2 === void 0 ? void 0 : (_packageAssetRefsRes$3 = _packageAssetRefsRes$2.attributes) === null || _packageAssetRefsRes$3 === void 0 ? void 0 : _packageAssetRefsRes$3.package_assets) !== null && _package_assets !== void 0 ? _package_assets : []).map(ref => ref.id);
  for (const oldVersion of oldVersions) {
    await removeAssetsFromVersion(soClient, pkgName, oldVersion, packageAssetRefs);
  }
}
async function removeAssetsFromVersion(soClient, pkgName, oldVersion, packageAssetRefs) {
  // check if any policies are using this package version
  const {
    total
  } = await _package_policy.packagePolicyService.list(soClient, {
    kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${pkgName} AND ${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.version:${oldVersion}`,
    page: 0,
    perPage: 0
  });
  // don't delete if still being used
  if (total > 0) {
    _.appContextService.getLogger().debug(`Package "${pkgName}-${oldVersion}" still being used by policies`);
    return;
  }

  // check if old version has assets
  const finder = await soClient.createPointInTimeFinder({
    type: _common.ASSETS_SAVED_OBJECT_TYPE,
    filter: `${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_name:${pkgName} AND ${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_version:${oldVersion}`,
    perPage: 1000,
    fields: ['id']
  });
  for await (const assets of finder.find()) {
    const refs = assets.saved_objects.map(obj => ({
      id: obj.id,
      type: _common.ASSETS_SAVED_OBJECT_TYPE
    }));
    // only delete epm-packages-assets that are not referenced by epm-packages
    const unusedRefs = refs.filter(ref => !packageAssetRefs.includes(ref.id));
    await (0, _storage.removeArchiveEntries)({
      savedObjectsClient: soClient,
      refs: unusedRefs
    });
  }
  await finder.close();
}