"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJWTAssertion = createJWTAssertion;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createJWTAssertion(logger, privateKey, privateKeyPassword, reservedClaims) {
  const {
    subject,
    audience,
    issuer,
    expireInMilliseconds,
    keyId
  } = reservedClaims;
  const iat = Math.floor(Date.now() / 1000);
  const headerObj = {
    algorithm: 'RS256',
    ...(keyId ? {
      keyid: keyId
    } : {})
  };
  const payloadObj = {
    sub: subject,
    // subject claim identifies the principal that is the subject of the JWT
    aud: audience,
    // audience claim identifies the recipients that the JWT is intended for
    iss: issuer,
    // issuer claim identifies the principal that issued the JWT
    iat,
    // issued at claim identifies the time at which the JWT was issued
    exp: iat + (expireInMilliseconds !== null && expireInMilliseconds !== void 0 ? expireInMilliseconds : 3600) // expiration time claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing
  };

  try {
    const jwtToken = _jsonwebtoken.default.sign(payloadObj, privateKeyPassword ? {
      key: privateKey,
      passphrase: privateKeyPassword
    } : privateKey, headerObj);
    return jwtToken;
  } catch (error) {
    const errorMessage = `Unable to generate JWT token. Error: ${error}`;
    logger.warn(errorMessage);
    throw new Error(errorMessage);
  }
}