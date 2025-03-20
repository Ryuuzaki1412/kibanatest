"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRecordAnalyticsOnAuthTypeRoutes = defineRecordAnalyticsOnAuthTypeRoutes;
var _crypto = require("crypto");
var _configSchema = require("@kbn/config-schema");
var _authentication = require("../../authentication");
var _errors = require("../../errors");
var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A minimum interval between usage collection of the authentication type for
 * the Kibana interactive user.
 */
const MINIMUM_ELAPSED_TIME_HOURS = 12;
function defineRecordAnalyticsOnAuthTypeRoutes({
  getAuthenticationService,
  router,
  analyticsService,
  logger
}) {
  router.post({
    path: '/internal/security/analytics/_record_auth_type',
    validate: {
      body: _configSchema.schema.nullable(_configSchema.schema.object({
        signature: _configSchema.schema.string(),
        timestamp: _configSchema.schema.number()
      }))
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      var _HTTPAuthorizationHea, _authTypeEventToRepor;
      const authUser = getAuthenticationService().getCurrentUser(request);
      if (!authUser) {
        logger.warn('Cannot record authentication type: current user could not be retrieved.');
        return response.noContent();
      }
      let timestamp = new Date().getTime();
      const {
        signature: previouslyRegisteredSignature,
        timestamp: previousRegistrationTimestamp
      } = request.body || {
        authTypeHash: '',
        timestamp
      };
      const authTypeEventToReport = {
        authenticationProviderType: authUser.authentication_provider.type,
        authenticationRealmType: authUser.authentication_realm.type,
        httpAuthenticationScheme: authUser.authentication_provider.type === _authentication.HTTPAuthenticationProvider.type ? (_HTTPAuthorizationHea = _authentication.HTTPAuthorizationHeader.parseFromRequest(request)) === null || _HTTPAuthorizationHea === void 0 ? void 0 : _HTTPAuthorizationHea.scheme : undefined
      };

      // We calculate the "signature" of the authentication type event to avoid reporting the
      // same events too frequently.
      const signature = (0, _crypto.createHash)('sha3-256').update(authUser.username).update(authTypeEventToReport.authenticationProviderType).update(authTypeEventToReport.authenticationRealmType).update((_authTypeEventToRepor = authTypeEventToReport.httpAuthenticationScheme) !== null && _authTypeEventToRepor !== void 0 ? _authTypeEventToRepor : '').digest('hex');
      const elapsedTimeInHrs = (timestamp - previousRegistrationTimestamp) / (1000 * 60 * 60);
      if (elapsedTimeInHrs >= MINIMUM_ELAPSED_TIME_HOURS || previouslyRegisteredSignature !== signature) {
        analyticsService.reportAuthenticationTypeEvent(authTypeEventToReport);
        logApiKeyWithInteractiveUserDeprecated(authTypeEventToReport.httpAuthenticationScheme, logger);
      } else {
        timestamp = previousRegistrationTimestamp;
      }
      return response.ok({
        body: {
          signature,
          timestamp
        }
      });
    } catch (err) {
      logger.error(`Failed to record authentication type for the user: ${(0, _errors.getDetailedErrorMessage)(err)}`);
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(err));
    }
  }));
}

/**
 * API Key authentication by interactive users is deprecated, this method logs a deprecation warning.
 *
 * @param httpAuthenticationScheme A string representing the authentication type event's scheme (ApiKey, etc.) by an interactive user.
 * @param logger A reference to the Logger to log the deprecation message.
 */
function logApiKeyWithInteractiveUserDeprecated(httpAuthenticationScheme = '', logger) {
  const isUsingApiKey = (httpAuthenticationScheme === null || httpAuthenticationScheme === void 0 ? void 0 : httpAuthenticationScheme.toLowerCase()) === 'apikey';
  if (isUsingApiKey) {
    logger.warn(`API keys are intended for programmatic access. Do not use API keys to authenticate access via a web browser.`, {
      tags: ['deprecation']
    });
  }
}