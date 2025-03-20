"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateCommonSecrets = exports.validateCommonConnector = exports.validateCommonConfig = exports.validate = void 0;
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateCommonConfig = (config, validatorServices) => {
  const {
    isOAuth,
    apiUrl,
    userIdentifierValue,
    clientId,
    jwtKeyId
  } = config;
  const {
    configurationUtilities
  } = validatorServices;
  try {
    configurationUtilities.ensureUriAllowed(apiUrl);
  } catch (allowedListError) {
    throw new Error(i18n.ALLOWED_HOSTS_ERROR(allowedListError.message));
  }
  if (isOAuth) {
    if (userIdentifierValue == null) {
      throw new Error(i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('userIdentifierValue', true));
    }
    if (clientId == null) {
      throw new Error(i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('clientId', true));
    }
    if (jwtKeyId == null) {
      throw new Error(i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('jwtKeyId', true));
    }
  }
};
exports.validateCommonConfig = validateCommonConfig;
const validateCommonSecrets = (secrets, validatorServices) => {
  const {
    username,
    password,
    clientSecret,
    privateKey
  } = secrets;
  if (!username && !password && !clientSecret && !privateKey) {
    throw new Error(i18n.CREDENTIALS_ERROR);
  }
  if (username || password) {
    // Username and password must be set and set together
    if (!username || !password) {
      throw new Error(i18n.BASIC_AUTH_CREDENTIALS_ERROR);
    }
  } else if (clientSecret || privateKey) {
    // Client secret and private key must be set and set together
    if (!clientSecret || !privateKey) {
      throw new Error(i18n.OAUTH_CREDENTIALS_ERROR);
    }
  }
};
exports.validateCommonSecrets = validateCommonSecrets;
const validateCommonConnector = (config, secrets) => {
  const {
    isOAuth,
    userIdentifierValue,
    clientId,
    jwtKeyId
  } = config;
  const {
    username,
    password,
    clientSecret,
    privateKey
  } = secrets;
  if (isOAuth) {
    if (userIdentifierValue == null) {
      return i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('userIdentifierValue', true);
    }
    if (clientId == null) {
      return i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('clientId', true);
    }
    if (jwtKeyId == null) {
      return i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('jwtKeyId', true);
    }
    if (clientSecret == null) {
      return i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('clientSecret', true);
    }
    if (privateKey == null) {
      return i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('privateKey', true);
    }
    if (username || password) {
      return i18n.VALIDATE_OAUTH_POPULATED_FIELD_ERROR('Username and password', true);
    }
  } else {
    if (username == null) {
      return i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('username', false);
    }
    if (password == null) {
      return i18n.VALIDATE_OAUTH_MISSING_FIELD_ERROR('password', false);
    }
    if (clientSecret || clientId || userIdentifierValue || jwtKeyId || privateKey) {
      return i18n.VALIDATE_OAUTH_POPULATED_FIELD_ERROR('clientId, clientSecret, userIdentifierValue, jwtKeyId and privateKey', false);
    }
  }
  return null;
};
exports.validateCommonConnector = validateCommonConnector;
const validate = {
  config: validateCommonConfig,
  secrets: validateCommonSecrets,
  connector: validateCommonConnector
};
exports.validate = validate;