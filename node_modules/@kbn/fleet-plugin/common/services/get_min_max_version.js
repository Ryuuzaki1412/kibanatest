"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxVersion = getMaxVersion;
exports.getMinVersion = getMinVersion;
exports.sortVersions = sortVersions;
var _lodash = require("lodash");
var _gt = _interopRequireDefault(require("semver/functions/gt"));
var _coerce = _interopRequireDefault(require("semver/functions/coerce"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Sort array in ascending order
function sortVersions(versions) {
  // remove duplicates and filter out invalid versions
  const uniqVersions = (0, _lodash.uniq)(versions).filter(v => {
    var _semverCoerce;
    return ((_semverCoerce = (0, _coerce.default)(v)) === null || _semverCoerce === void 0 ? void 0 : _semverCoerce.version) !== undefined;
  });
  if (uniqVersions.length > 1) {
    return uniqVersions.sort((a, b) => (0, _gt.default)(a, b) ? 1 : -1);
  }
  return uniqVersions;
}

// Find max version from an array of string versions
function getMaxVersion(versions) {
  const sorted = sortVersions(versions);
  if (sorted.length >= 1) {
    return sorted[sorted.length - 1];
  }
  return '';
}

// Find min version from an array of string versions
function getMinVersion(versions) {
  const sorted = sortVersions(versions);
  if (sorted.length >= 1) {
    return sorted[0];
  }
  return '';
}