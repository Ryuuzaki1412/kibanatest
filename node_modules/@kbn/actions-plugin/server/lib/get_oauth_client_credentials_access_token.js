"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOAuthClientCredentialsAccessToken = void 0;
var _request_oauth_client_credentials_token = require("./request_oauth_client_credentials_token");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getOAuthClientCredentialsAccessToken = async ({
  connectorId,
  logger,
  tokenUrl,
  oAuthScope,
  configurationUtilities,
  credentials,
  connectorTokenClient
}) => {
  const {
    clientId,
    tenantId
  } = credentials.config;
  const {
    clientSecret
  } = credentials.secrets;
  if (!clientId || !clientSecret || !tenantId) {
    logger.warn(`Missing required fields for requesting OAuth Client Credentials access token`);
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
    // Save the time before requesting token so we can use it to calculate expiration
    const requestTokenStart = Date.now();

    // request access token with jwt assertion
    const tokenResult = await (0, _request_oauth_client_credentials_token.requestOAuthClientCredentialsToken)(tokenUrl, logger, {
      scope: oAuthScope,
      clientId,
      clientSecret
    }, configurationUtilities);
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
exports.getOAuthClientCredentialsAccessToken = getOAuthClientCredentialsAccessToken;