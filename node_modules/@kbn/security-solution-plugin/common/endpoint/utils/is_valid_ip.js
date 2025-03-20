"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidIPv4OrCIDR = isValidIPv4OrCIDR;
var _ipaddr = _interopRequireDefault(require("ipaddr.js"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Validates that an IP is a valid ipv4 or CIDR.
 * The initial regex validates the format for x.x.x.x/xx
 * Then ipaddr is used for a deeper ipv4 validation
 */
function isValidIPv4OrCIDR(maybeIp) {
  const ipv4re = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
  if (ipv4re.test(maybeIp)) {
    try {
      _ipaddr.default.IPv4.parseCIDR(maybeIp);
      return true;
    } catch (e) {
      return _ipaddr.default.IPv4.isValid(maybeIp);
    }
  }
  return false;
}