"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServiceWrapper = createServiceWrapper;
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createServiceWrapper({
  connectorId,
  credentials,
  logger,
  configurationUtilities,
  serviceConfig,
  connectorTokenClient,
  createServiceFn
}) {
  const {
    config
  } = credentials;
  const {
    apiUrl: url
  } = config;
  const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  const axiosInstance = (0, _utils.getAxiosInstance)({
    connectorId,
    logger,
    configurationUtilities,
    credentials,
    snServiceUrl: urlWithoutTrailingSlash,
    connectorTokenClient
  });
  return createServiceFn({
    credentials,
    logger,
    configurationUtilities,
    serviceConfig,
    axiosInstance
  });
}