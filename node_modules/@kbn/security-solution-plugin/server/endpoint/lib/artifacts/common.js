"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportErrors = exports.getArtifactId = exports.ManifestConstants = exports.ArtifactConstants = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ArtifactConstants = {
  GLOBAL_ALLOWLIST_NAME: 'endpoint-exceptionlist',
  /**
   * Saved objects no longer used for storing artifacts
   * @deprecated
   */
  SAVED_OBJECT_TYPE: 'endpoint:user-artifact',
  SUPPORTED_OPERATING_SYSTEMS: ['macos', 'windows', 'linux'],
  SUPPORTED_TRUSTED_APPS_OPERATING_SYSTEMS: ['macos', 'windows', 'linux'],
  GLOBAL_TRUSTED_APPS_NAME: 'endpoint-trustlist',
  SUPPORTED_EVENT_FILTERS_OPERATING_SYSTEMS: ['macos', 'windows', 'linux'],
  GLOBAL_EVENT_FILTERS_NAME: 'endpoint-eventfilterlist',
  SUPPORTED_HOST_ISOLATION_EXCEPTIONS_OPERATING_SYSTEMS: ['macos', 'windows', 'linux'],
  GLOBAL_HOST_ISOLATION_EXCEPTIONS_NAME: 'endpoint-hostisolationexceptionlist',
  SUPPORTED_BLOCKLISTS_OPERATING_SYSTEMS: ['macos', 'windows', 'linux'],
  GLOBAL_BLOCKLISTS_NAME: 'endpoint-blocklist'
};
exports.ArtifactConstants = ArtifactConstants;
const ManifestConstants = {
  SAVED_OBJECT_TYPE: 'endpoint:user-artifact-manifest'
};
exports.ManifestConstants = ManifestConstants;
const getArtifactId = artifact => {
  return `${artifact.identifier}-${artifact.decodedSha256}`;
};
exports.getArtifactId = getArtifactId;
const reportErrors = (logger, errors) => {
  errors.forEach(err => {
    logger.error(err);
  });
};
exports.reportErrors = reportErrors;