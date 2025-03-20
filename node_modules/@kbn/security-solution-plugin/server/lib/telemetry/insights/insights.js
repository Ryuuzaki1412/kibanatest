"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertStatusPayloads = createAlertStatusPayloads;
exports.getSessionIDfromKibanaRequest = getSessionIDfromKibanaRequest;
var _moment = _interopRequireDefault(require("moment"));
var _jsSha = require("js-sha256");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getSessionIDfromKibanaRequest(clusterId, request) {
  const rawCookieHeader = request.headers.cookie;
  if (!rawCookieHeader) {
    return '';
  }
  const cookieHeaders = Array.isArray(rawCookieHeader) ? rawCookieHeader : [rawCookieHeader];
  let tokenPackage;
  cookieHeaders.flatMap(rawHeader => rawHeader.split('; ')).forEach(rawCookie => {
    const [cookieName, cookieValue] = rawCookie.split('=');
    if (cookieName === 'sid') tokenPackage = cookieValue;
  });
  if (tokenPackage) {
    return getClusterHashSalt(clusterId, tokenPackage);
  } else {
    return '';
  }
}
function getClusterHashSalt(clusterId, toHash) {
  const concatValue = toHash + clusterId;
  const sha = _jsSha.sha256.create().update(concatValue).hex();
  return sha;
}
function createAlertStatusPayloads(clusterId, alertIds, sessionId, username, route, status) {
  return alertIds.map(alertId => ({
    state: {
      route,
      cluster_id: clusterId,
      user_id: getClusterHashSalt(clusterId, username),
      session_id: sessionId,
      context: {
        alert_id: alertId
      }
    },
    action: {
      alert_status: status,
      action_timestamp: (0, _moment.default)().toISOString()
    }
  }));
}