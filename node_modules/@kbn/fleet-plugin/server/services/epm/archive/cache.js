"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setVerificationResult = exports.setPackageInfo = exports.setArchiveFilelist = exports.setArchiveEntry = exports.hasVerificationResult = exports.hasArchiveEntry = exports.getVerificationResult = exports.getPackageInfo = exports.getArchivePackage = exports.getArchiveFilelist = exports.getArchiveEntry = exports.deleteVerificationResult = exports.deletePackageInfo = exports.deleteArchiveFilelist = exports.deleteArchiveEntry = exports.clearVerificationResults = exports.clearPackageFileCache = exports.clearArchiveEntries = void 0;
var _ = require("../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const sharedKey = ({
  name,
  version
}) => `${name}-${version}`;
const archiveEntryCache = new Map();
const getArchiveEntry = key => archiveEntryCache.get(key);
exports.getArchiveEntry = getArchiveEntry;
const setArchiveEntry = (key, value) => archiveEntryCache.set(key, value);
exports.setArchiveEntry = setArchiveEntry;
const hasArchiveEntry = key => archiveEntryCache.has(key);
exports.hasArchiveEntry = hasArchiveEntry;
const clearArchiveEntries = () => archiveEntryCache.clear();
exports.clearArchiveEntries = clearArchiveEntries;
const deleteArchiveEntry = key => archiveEntryCache.delete(key);
exports.deleteArchiveEntry = deleteArchiveEntry;
const verificationResultCache = new Map();
const getVerificationResult = key => verificationResultCache.get(sharedKey(key));
exports.getVerificationResult = getVerificationResult;
const setVerificationResult = (key, value) => verificationResultCache.set(sharedKey(key), value);
exports.setVerificationResult = setVerificationResult;
const hasVerificationResult = key => verificationResultCache.has(sharedKey(key));
exports.hasVerificationResult = hasVerificationResult;
const clearVerificationResults = () => verificationResultCache.clear();
exports.clearVerificationResults = clearVerificationResults;
const deleteVerificationResult = key => verificationResultCache.delete(sharedKey(key));
exports.deleteVerificationResult = deleteVerificationResult;
const archiveFilelistCache = new Map();
const getArchiveFilelist = keyArgs => archiveFilelistCache.get(sharedKey(keyArgs));
exports.getArchiveFilelist = getArchiveFilelist;
const setArchiveFilelist = (keyArgs, paths) => {
  const logger = _.appContextService.getLogger();
  logger.debug(`setting file list to the cache for ${keyArgs.name}-${keyArgs.version}`);
  logger.trace(JSON.stringify(paths));
  return archiveFilelistCache.set(sharedKey(keyArgs), paths);
};
exports.setArchiveFilelist = setArchiveFilelist;
const deleteArchiveFilelist = keyArgs => archiveFilelistCache.delete(sharedKey(keyArgs));
exports.deleteArchiveFilelist = deleteArchiveFilelist;
const packageInfoCache = new Map();
const getPackageInfo = args => {
  return packageInfoCache.get(sharedKey(args));
};
exports.getPackageInfo = getPackageInfo;
const getArchivePackage = args => {
  const packageInfo = getPackageInfo(args);
  const paths = getArchiveFilelist(args);
  if (!paths || !packageInfo) return undefined;
  return {
    paths,
    packageInfo
  };
};

/*
 * This cache should only be used to store "full" package info generated from the package archive.
 * NOT package info from the EPR API. This is because we parse extra fields from the archive
 * which are not provided by the registry API.
 */
exports.getArchivePackage = getArchivePackage;
const setPackageInfo = ({
  name,
  version,
  packageInfo
}) => {
  const logger = _.appContextService.getLogger();
  const key = sharedKey({
    name,
    version
  });
  logger.debug(`setting package info to the cache for ${name}-${version}`);
  logger.trace(JSON.stringify(packageInfo));
  return packageInfoCache.set(key, packageInfo);
};
exports.setPackageInfo = setPackageInfo;
const deletePackageInfo = args => packageInfoCache.delete(sharedKey(args));
exports.deletePackageInfo = deletePackageInfo;
const clearPackageFileCache = args => {
  var _getArchiveFilelist;
  const fileList = (_getArchiveFilelist = getArchiveFilelist(args)) !== null && _getArchiveFilelist !== void 0 ? _getArchiveFilelist : [];
  fileList.forEach(filePath => {
    deleteArchiveEntry(filePath);
  });
  deleteArchiveFilelist(args);
};
exports.clearPackageFileCache = clearPackageFileCache;