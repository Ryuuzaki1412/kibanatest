"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_EXECUTION_ERRORS_RESULT = void 0;
exports.formatExecutionErrorsResult = formatExecutionErrorsResult;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EXECUTION_UUID_FIELD = 'kibana.alert.rule.execution.uuid';
const TIMESTAMP_FIELD = '@timestamp';
const PROVIDER_FIELD = 'event.provider';
const MESSAGE_FIELD = 'message';
const ERROR_MESSAGE_FIELD = 'error.message';
const EMPTY_EXECUTION_ERRORS_RESULT = {
  totalErrors: 0,
  errors: []
};
exports.EMPTY_EXECUTION_ERRORS_RESULT = EMPTY_EXECUTION_ERRORS_RESULT;
function formatEvent(event) {
  const message = (0, _lodash.get)(event, MESSAGE_FIELD, '');
  const errorMessage = (0, _lodash.get)(event, ERROR_MESSAGE_FIELD, null);
  return {
    id: (0, _lodash.get)(event, EXECUTION_UUID_FIELD, ''),
    timestamp: (0, _lodash.get)(event, TIMESTAMP_FIELD, ''),
    type: (0, _lodash.get)(event, PROVIDER_FIELD, ''),
    message: errorMessage ? `${message} - ${errorMessage}` : message
  };
}
function formatExecutionErrorsResult(results) {
  const {
    total,
    data
  } = results;
  if (!data) {
    return EMPTY_EXECUTION_ERRORS_RESULT;
  }
  return {
    totalErrors: total,
    errors: data.map(event => formatEvent(event))
  };
}