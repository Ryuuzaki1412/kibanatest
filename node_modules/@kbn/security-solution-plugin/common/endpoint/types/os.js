"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolicyOperatingSystem = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// PolicyConfig uses mac instead of macos
let PolicyOperatingSystem;
exports.PolicyOperatingSystem = PolicyOperatingSystem;
(function (PolicyOperatingSystem) {
  PolicyOperatingSystem["windows"] = "windows";
  PolicyOperatingSystem["mac"] = "mac";
  PolicyOperatingSystem["linux"] = "linux";
})(PolicyOperatingSystem || (exports.PolicyOperatingSystem = PolicyOperatingSystem = {}));