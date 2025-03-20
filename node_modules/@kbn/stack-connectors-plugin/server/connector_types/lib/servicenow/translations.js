"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALIDATE_OAUTH_POPULATED_FIELD_ERROR = exports.VALIDATE_OAUTH_MISSING_FIELD_ERROR = exports.SERVICENOW_SIR = exports.SERVICENOW_ITSM = exports.SERVICENOW_ITOM = exports.SERVICENOW = exports.OAUTH_CREDENTIALS_ERROR = exports.CREDENTIALS_ERROR = exports.BASIC_AUTH_CREDENTIALS_ERROR = exports.ALLOWED_HOSTS_ERROR = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SERVICENOW = _i18n.i18n.translate('xpack.stackConnectors.serviceNow.title', {
  defaultMessage: 'ServiceNow'
});
exports.SERVICENOW = SERVICENOW;
const SERVICENOW_ITSM = _i18n.i18n.translate('xpack.stackConnectors.serviceNowITSM.title', {
  defaultMessage: 'ServiceNow ITSM'
});
exports.SERVICENOW_ITSM = SERVICENOW_ITSM;
const SERVICENOW_SIR = _i18n.i18n.translate('xpack.stackConnectors.serviceNowSIR.title', {
  defaultMessage: 'ServiceNow SecOps'
});
exports.SERVICENOW_SIR = SERVICENOW_SIR;
const SERVICENOW_ITOM = _i18n.i18n.translate('xpack.stackConnectors.serviceNowITOM.title', {
  defaultMessage: 'ServiceNow ITOM'
});
exports.SERVICENOW_ITOM = SERVICENOW_ITOM;
const ALLOWED_HOSTS_ERROR = message => _i18n.i18n.translate('xpack.stackConnectors.serviceNow.configuration.apiAllowedHostsError', {
  defaultMessage: 'error configuring connector action: {message}',
  values: {
    message
  }
});
exports.ALLOWED_HOSTS_ERROR = ALLOWED_HOSTS_ERROR;
const CREDENTIALS_ERROR = _i18n.i18n.translate('xpack.stackConnectors.serviceNow.configuration.apiCredentialsError', {
  defaultMessage: 'Either basic auth or OAuth credentials must be specified'
});
exports.CREDENTIALS_ERROR = CREDENTIALS_ERROR;
const BASIC_AUTH_CREDENTIALS_ERROR = _i18n.i18n.translate('xpack.stackConnectors.serviceNow.configuration.apiBasicAuthCredentialsError', {
  defaultMessage: 'username and password must both be specified'
});
exports.BASIC_AUTH_CREDENTIALS_ERROR = BASIC_AUTH_CREDENTIALS_ERROR;
const OAUTH_CREDENTIALS_ERROR = _i18n.i18n.translate('xpack.stackConnectors.serviceNow.configuration.apiOAuthCredentialsError', {
  defaultMessage: 'clientSecret and privateKey must both be specified'
});
exports.OAUTH_CREDENTIALS_ERROR = OAUTH_CREDENTIALS_ERROR;
const VALIDATE_OAUTH_MISSING_FIELD_ERROR = (field, isOAuth) => _i18n.i18n.translate('xpack.stackConnectors.serviceNow.configuration.apiValidateMissingOAuthFieldError', {
  defaultMessage: '{field} must be provided when isOAuth = {isOAuth}',
  values: {
    field,
    isOAuth: isOAuth ? 'true' : 'false'
  }
});
exports.VALIDATE_OAUTH_MISSING_FIELD_ERROR = VALIDATE_OAUTH_MISSING_FIELD_ERROR;
const VALIDATE_OAUTH_POPULATED_FIELD_ERROR = (field, isOAuth) => _i18n.i18n.translate('xpack.stackConnectors.serviceNow.configuration.apiValidateOAuthFieldError', {
  defaultMessage: '{field} should not be provided with isOAuth = {isOAuth}',
  values: {
    field,
    isOAuth: isOAuth ? 'true' : 'false'
  }
});
exports.VALIDATE_OAUTH_POPULATED_FIELD_ERROR = VALIDATE_OAUTH_POPULATED_FIELD_ERROR;