"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProxyAgent = getProxyAgent;
exports.getProxyAgentOptions = getProxyAgentOptions;
exports.getRegistryProxyUrl = getRegistryProxyUrl;
var _httpProxyAgent = require("http-proxy-agent");
var _httpsProxyAgent = require("https-proxy-agent");
var _ = require("../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getRegistryProxyUrl() {
  var _appContextService$ge;
  const proxyUrl = (_appContextService$ge = _.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.registryProxyUrl;
  return proxyUrl;
}
function getProxyAgent(options) {
  const isHttps = options.targetUrl.startsWith('https:');
  const agentOptions = isHttps ? getProxyAgentOptions(options) : options.proxyUrl;
  const agent = isHttps ? new _httpsProxyAgent.HttpsProxyAgent(agentOptions) : new _httpProxyAgent.HttpProxyAgent(agentOptions);
  return agent;
}
function getProxyAgentOptions(options) {
  const endpointParsed = new URL(options.targetUrl);
  const proxyParsed = new URL(options.proxyUrl);
  const authValue = proxyParsed.username ? `${proxyParsed.username}:${proxyParsed.password}` : undefined;
  return {
    host: proxyParsed.hostname,
    port: Number(proxyParsed.port),
    protocol: proxyParsed.protocol,
    auth: authValue,
    // The headers to send
    headers: options.proxyHeaders || {
      // the proxied URL's host is put in the header instead of the server's actual host
      Host: endpointParsed.host
    },
    // do not fail on invalid certs if value is false
    rejectUnauthorized: options.proxyRejectUnauthorizedCertificates
  };
}