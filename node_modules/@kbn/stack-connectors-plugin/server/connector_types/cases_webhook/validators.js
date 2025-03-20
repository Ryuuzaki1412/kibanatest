"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSecrets = exports.validateJson = exports.validateConnector = exports.validateAndNormalizeUrl = exports.validate = exports.normalizeURL = exports.ensureUriAllowed = exports.assertURL = void 0;
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateConfig = (configObject, validatorServices) => {
  const {
    configurationUtilities
  } = validatorServices;
  const {
    createCommentUrl,
    createIncidentUrl,
    viewIncidentUrl,
    getIncidentUrl,
    updateIncidentUrl
  } = configObject;
  const urls = [createIncidentUrl, createCommentUrl, viewIncidentUrl, getIncidentUrl, updateIncidentUrl];
  for (const url of urls) {
    if (url) {
      try {
        new URL(url);
      } catch (err) {
        throw new Error(i18n.INVALID_URL(err, url));
      }
      try {
        configurationUtilities.ensureUriAllowed(url);
      } catch (allowListError) {
        throw new Error(i18n.CONFIG_ERR(allowListError.message));
      }
    }
  }
};
const validateConnector = (configObject, secrets) => {
  // user and password must be set together (or not at all)
  if (!configObject.hasAuth) return null;
  if (secrets.password && secrets.user) return null;
  return i18n.INVALID_USER_PW;
};
exports.validateConnector = validateConnector;
const validateSecrets = (secrets, validatorServices) => {
  // user and password must be set together (or not at all)
  if (!secrets.password && !secrets.user) return;
  if (secrets.password && secrets.user) return;
  throw new Error(i18n.INVALID_USER_PW);
};
exports.validateSecrets = validateSecrets;
const validate = {
  config: validateConfig,
  secrets: validateSecrets,
  connector: validateConnector
};
exports.validate = validate;
const validProtocols = ['http:', 'https:'];
const assertURL = url => {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.hostname) {
      throw new Error(`URL must contain hostname`);
    }
    if (!validProtocols.includes(parsedUrl.protocol)) {
      throw new Error(`Invalid protocol`);
    }
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};
exports.assertURL = assertURL;
const ensureUriAllowed = (url, configurationUtilities) => {
  try {
    configurationUtilities.ensureUriAllowed(url);
  } catch (allowedListError) {
    throw Error(`${i18n.ALLOWED_HOSTS_ERROR(allowedListError.message)}`);
  }
};
exports.ensureUriAllowed = ensureUriAllowed;
const normalizeURL = url => {
  const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  const replaceDoubleSlashesRegex = new RegExp('([^:]/)/+', 'g');
  return urlWithoutTrailingSlash.replace(replaceDoubleSlashesRegex, '$1');
};
exports.normalizeURL = normalizeURL;
const validateAndNormalizeUrl = (url, configurationUtilities, urlDesc) => {
  try {
    assertURL(url);
    ensureUriAllowed(url, configurationUtilities);
    return normalizeURL(url);
  } catch (e) {
    throw Error(`Invalid ${urlDesc}: ${e}`);
  }
};
exports.validateAndNormalizeUrl = validateAndNormalizeUrl;
const validateJson = (jsonString, jsonDesc) => {
  try {
    JSON.parse(jsonString);
  } catch (e) {
    throw new Error(`JSON Error: ${jsonDesc} must be valid JSON`);
  }
};
exports.validateJson = validateJson;