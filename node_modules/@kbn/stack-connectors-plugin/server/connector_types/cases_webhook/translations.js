"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NAME = exports.INVALID_USER_PW = exports.INVALID_URL = exports.CONFIG_ERR = exports.ALLOWED_HOSTS_ERROR = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NAME = _i18n.i18n.translate('xpack.stackConnectors.casesWebhook.title', {
  defaultMessage: 'Webhook - Case Management'
});
exports.NAME = NAME;
const INVALID_URL = (err, url) => _i18n.i18n.translate('xpack.stackConnectors.casesWebhook.configurationErrorNoHostname', {
  defaultMessage: 'error configuring cases webhook action: unable to parse {url}: {err}',
  values: {
    err,
    url
  }
});
exports.INVALID_URL = INVALID_URL;
const CONFIG_ERR = err => _i18n.i18n.translate('xpack.stackConnectors.casesWebhook.configurationError', {
  defaultMessage: 'error configuring cases webhook action: {err}',
  values: {
    err
  }
});
exports.CONFIG_ERR = CONFIG_ERR;
const INVALID_USER_PW = _i18n.i18n.translate('xpack.stackConnectors.casesWebhook.invalidUsernamePassword', {
  defaultMessage: 'both user and password must be specified'
});
exports.INVALID_USER_PW = INVALID_USER_PW;
const ALLOWED_HOSTS_ERROR = message => _i18n.i18n.translate('xpack.stackConnectors.casesWebhook.configuration.apiAllowedHostsError', {
  defaultMessage: 'error configuring connector action: {message}',
  values: {
    message
  }
});
exports.ALLOWED_HOSTS_ERROR = ALLOWED_HOSTS_ERROR;