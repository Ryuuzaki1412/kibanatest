"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPolicyArtifactManifest = void 0;
var _services = require("../../endpoint/services");
var _artifacts = require("../../endpoint/lib/artifacts");
var _manifest2 = require("../../../common/endpoint/schema/manifest");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getManifest = async (logger, manifestManager) => {
  var _manifest;
  let manifest = null;
  try {
    manifest = await manifestManager.getLastComputedManifest();

    // If we have not yet computed a manifest, then we have to do so now. This should only happen
    // once.
    if (manifest == null) {
      // New computed manifest based on current state of exception list
      const newManifest = await manifestManager.buildNewManifest();

      // Persist new artifacts
      const persistErrors = await manifestManager.pushArtifacts(newManifest.getAllArtifacts(), newManifest);
      if (persistErrors.length) {
        (0, _artifacts.reportErrors)(logger, persistErrors);
        throw new Error('Unable to persist new artifacts.');
      }

      // Commit the manifest state
      await manifestManager.commit(newManifest);
      manifest = newManifest;
    }
  } catch (err) {
    logger.error(err);
  }
  return (_manifest = manifest) !== null && _manifest !== void 0 ? _manifest : _services.ManifestManager.createDefaultManifest();
};

/**
 * Creates the initial manifest to be included in a policy when it is first created in fleet
 */
const createPolicyArtifactManifest = async (logger, manifestManager) => {
  // Get most recent manifest
  const manifest = await getManifest(logger, manifestManager);
  const serializedManifest = manifest.toPackagePolicyManifest();
  if (!_manifest2.manifestDispatchSchema.is(serializedManifest)) {
    // This should not happen.
    // But if it does, we log it and return it anyway.
    logger.error('Invalid manifest');
  }
  return serializedManifest;
};
exports.createPolicyArtifactManifest = createPolicyArtifactManifest;