"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.versionService = exports.Version = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _semver = _interopRequireDefault(require("semver/classes/semver"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class Version {
  constructor() {
    (0, _defineProperty2.default)(this, "version", void 0);
  }
  setup(version) {
    this.version = new _semver.default(version);
  }
  getCurrentVersion() {
    return this.version;
  }
  getMajorVersion() {
    var _this$version;
    return (_this$version = this.version) === null || _this$version === void 0 ? void 0 : _this$version.major;
  }
  getNextMajorVersion() {
    var _this$version2;
    return ((_this$version2 = this.version) === null || _this$version2 === void 0 ? void 0 : _this$version2.major) + 1;
  }
  getPrevMajorVersion() {
    var _this$version3;
    return ((_this$version3 = this.version) === null || _this$version3 === void 0 ? void 0 : _this$version3.major) - 1;
  }
}
exports.Version = Version;
const versionService = new Version();
exports.versionService = versionService;