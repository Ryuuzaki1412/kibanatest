"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertUrlTransaction = exports.getAlertUrlErrorCount = void 0;
var _querystring = require("querystring");
var _environment_filter_values = require("../../environment_filter_values");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const format = ({
  pathname,
  query
}) => {
  return `${pathname}?${(0, _querystring.stringify)(query)}`;
};
const getAlertUrlErrorCount = (serviceName, serviceEnv) => format({
  pathname: `/app/apm/services/${serviceName}/errors`,
  query: {
    environment: serviceEnv !== null && serviceEnv !== void 0 ? serviceEnv : _environment_filter_values.ENVIRONMENT_ALL.value
  }
});
// This formatter is for TransactionDuration, TransactionErrorRate, and Anomaly.
exports.getAlertUrlErrorCount = getAlertUrlErrorCount;
const getAlertUrlTransaction = (serviceName, serviceEnv, transactionType) => format({
  pathname: `/app/apm/services/${serviceName}`,
  query: {
    transactionType,
    environment: serviceEnv !== null && serviceEnv !== void 0 ? serviceEnv : _environment_filter_values.ENVIRONMENT_ALL.value
  }
});
exports.getAlertUrlTransaction = getAlertUrlTransaction;