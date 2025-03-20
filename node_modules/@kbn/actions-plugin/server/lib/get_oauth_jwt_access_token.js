"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOAuthJwtAccessToken = void 0;
var _create_jwt_assertion = require("./create_jwt_assertion");
var _request_oauth_jwt_token = require("./request_oauth_jwt_token");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getOAuthJwtAccessToken = async ({
  connectorId,
  logger,
  tokenUrl,
  configurationUtilities,
  credentials,
  connectorTokenClient
}) => {
  const {
    clientId,
    jwtKeyId,
    userIdentifierValue
  } = credentials.config;
  const {
    clientSecret,
    privateKey,
    privateKeyPassword
  } = credentials.secrets;
  if (!clientId || !clientSecret || !jwtKeyId || !privateKey || !userIdentifierValue) {
    logger.warn(`Missing required fields for requesting OAuth JWT access token`);
    return null;
  }
  let accessToken;
  let connectorToken = null;
  let hasErrors = false;
  if (connectorId && connectorTokenClient) {
    // Check if there is a token stored for this connector
    const {
      connectorToken: token,
      hasErrors: errors
    } = await connectorTokenClient.get({
      connectorId
    });
    connectorToken = token;
    hasErrors = errors;
  }
  if (connectorToken === null || Date.parse(connectorToken.expiresAt) <= Date.now()) {
    // generate a new assertion
    const assertion = (0, _create_jwt_assertion.createJWTAssertion)(logger, privateKey, privateKeyPassword, {
      audience: clientId,
      issuer: clientId,
      subject: userIdentifierValue,
      keyId: jwtKeyId
    });

    // Save the time before requesting token so we can use it to calculate expiration
    const requestTokenStart = Date.now();

    // request access token with jwt assertion
    const tokenResult = await (0, _request_oauth_jwt_token.requestOAuthJWTToken)(tokenUrl, {
      clientId,
      clientSecret,
      assertion
    }, logger, configurationUtilities);
    accessToken = `${tokenResult.tokenType} ${tokenResult.accessToken}`;

    // try to update connector_token SO
    if (connectorId && connectorTokenClient) {
      try {
        await connectorTokenClient.updateOrReplace({
          connectorId,
          token: connectorToken,
          newToken: accessToken,
          tokenRequestDate: requestTokenStart,
          expiresInSec: tokenResult.expiresIn,
          deleteExisting: hasErrors
        });
      } catch (err) {
        logger.warn(`Not able to update connector token for connectorId: ${connectorId} due to error: ${err.message}`);
      }
    }
  } else {
    // use existing valid token
    accessToken = connectorToken.token;
  }
  return accessToken;
};
exports.getOAuthJwtAccessToken = getOAuthJwtAccessToken;