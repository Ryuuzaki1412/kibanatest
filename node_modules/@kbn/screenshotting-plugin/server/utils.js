"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paths = exports.install = exports.getChromiumPackage = exports.download = void 0;
var _os = _interopRequireDefault(require("os"));
var _browsers = require("./browsers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paths = new _browsers.ChromiumArchivePaths();
exports.paths = paths;
const getChromiumPackage = () => {
  const platform = process.platform;
  const architecture = _os.default.arch();
  const chromiumPackageInfo = paths.find(process.platform, architecture);
  if (!chromiumPackageInfo) {
    throw new Error(`Unsupported platform: ${platform}-${architecture}`);
  }
  return chromiumPackageInfo;
};
exports.getChromiumPackage = getChromiumPackage;
const download = _browsers.download.bind(undefined, paths);
exports.download = download;
const install = _browsers.install.bind(undefined, paths);
exports.install = install;