"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isVersionSupported = exports.isOsSupported = exports.isIsolationSupported = void 0;
var _lte = _interopRequireDefault(require("semver/functions/lte"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const minSupportedVersion = '7.14.0';
const minCapabilitiesVersion = '7.15.0';
const supportedOssMap = {
  macos: true,
  windows: true
};
const isolationCapability = 'isolation';
function parseSemver(semver) {
  return semver.includes('-') ? semver.substring(0, semver.indexOf('-')) : semver;
}
const isVersionSupported = ({
  currentVersion,
  minVersionRequired = minSupportedVersion
}) => {
  // `parseSemver()` will throw if the version provided is not a valid semver value.
  // If that happens, then just return false from this function
  try {
    const parsedCurrentVersion = parseSemver(currentVersion);
    return (0, _lte.default)(minVersionRequired, parsedCurrentVersion);
  } catch (e) {
    // If running in the browser, log to console
    if (window && window.console) {
      window.console.warn(`SecuritySolution: isVersionSupported(): Unable to determine if current version [${currentVersion}] meets minimum version [${minVersionRequired}]. Error: ${e.message}`);
    }
    return false;
  }
};
exports.isVersionSupported = isVersionSupported;
const isOsSupported = ({
  currentOs,
  supportedOss = supportedOssMap
}) => !!supportedOss[currentOs];
exports.isOsSupported = isOsSupported;
function isCapabilitiesSupported(semver) {
  const parsedVersion = parseSemver(semver);
  // capabilities is only available from 7.15+
  return (0, _lte.default)(minCapabilitiesVersion, parsedVersion);
}
function isIsolationSupportedCapabilities(capabilities = []) {
  return capabilities.includes(isolationCapability);
}

// capabilities isn't introduced until 7.15 so check the OS for support
function isIsolationSupportedOS(osName) {
  const normalizedOs = osName.toLowerCase();
  return isOsSupported({
    currentOs: normalizedOs
  });
}
const isIsolationSupported = ({
  osName,
  version,
  capabilities
}) => {
  if (!version || !isVersionSupported({
    currentVersion: version
  })) return false;
  return isCapabilitiesSupported(version) ? isIsolationSupportedCapabilities(capabilities) : isIsolationSupportedOS(osName);
};
exports.isIsolationSupported = isIsolationSupported;