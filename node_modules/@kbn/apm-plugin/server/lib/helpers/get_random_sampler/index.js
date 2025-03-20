"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomSampler = getRandomSampler;
var _seedrandom = _interopRequireDefault(require("seedrandom"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getRandomSampler({
  security,
  request,
  probability
}) {
  let seed = 1;
  if (security) {
    var _securityPluginStart$;
    const securityPluginStart = await security.start();
    const username = (_securityPluginStart$ = securityPluginStart.authc.getCurrentUser(request)) === null || _securityPluginStart$ === void 0 ? void 0 : _securityPluginStart$.username;
    if (username) {
      seed = Math.abs((0, _seedrandom.default)(username).int32());
    }
  }
  return {
    probability,
    seed
  };
}