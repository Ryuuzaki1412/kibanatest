"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorMessage = getErrorMessage;
exports.isErrorResponse = isErrorResponse;
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isErrorResponse(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['body']) && (0, _mlIsPopulatedObject.isPopulatedObject)(arg.body, ['message']) && arg.body.message !== undefined;
}
function getErrorMessage(error) {
  if (isErrorResponse(error)) {
    return `${error.body.error}: ${error.body.message}`;
  }
  if ((0, _mlIsPopulatedObject.isPopulatedObject)(error, ['message']) && typeof error.message === 'string') {
    return error.message;
  }
  return JSON.stringify(error);
}