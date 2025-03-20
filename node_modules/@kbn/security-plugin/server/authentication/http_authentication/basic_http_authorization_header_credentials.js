"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicHTTPAuthorizationHeaderCredentials = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class BasicHTTPAuthorizationHeaderCredentials {
  /**
   * Username, referred to as the `user-id` in https://tools.ietf.org/html/rfc7617.
   */

  /**
   * Password used to authenticate
   */

  constructor(username, password) {
    (0, _defineProperty2.default)(this, "username", void 0);
    (0, _defineProperty2.default)(this, "password", void 0);
    this.username = username;
    this.password = password;
  }

  /**
   * Parses the username and password from the credentials included in a HTTP Authorization header
   * for the Basic scheme https://tools.ietf.org/html/rfc7617
   * @param credentials The credentials extracted from the HTTP Authorization header
   */
  static parseFromCredentials(credentials) {
    const decoded = Buffer.from(credentials, 'base64').toString();
    if (decoded.indexOf(':') === -1) {
      throw new Error('Unable to parse basic authentication credentials without a colon');
    }
    const [username] = decoded.split(':');
    // according to https://tools.ietf.org/html/rfc7617, everything
    // after the first colon is considered to be part of the password
    const password = decoded.substring(username.length + 1);
    return new BasicHTTPAuthorizationHeaderCredentials(username, password);
  }
  toString() {
    return Buffer.from(`${this.username}:${this.password}`).toString('base64');
  }
}
exports.BasicHTTPAuthorizationHeaderCredentials = BasicHTTPAuthorizationHeaderCredentials;