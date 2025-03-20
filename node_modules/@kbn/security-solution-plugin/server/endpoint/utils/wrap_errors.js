"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapErrorIfNeeded = exports.catchAndWrapError = void 0;
var _errors = require("../../../common/endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Will wrap the given Error with `EndpointError`, which will help getting a good picture of where in
 * our code the error originated (better stack trace).
 */
const wrapErrorIfNeeded = error => {
  return error instanceof _errors.EndpointError ? error : new _errors.EndpointError(error.message, error);
};

/**
 * used as the callback to `Promise#catch()` to ensure errors
 * (especially those from kibana/elasticsearch clients) are wrapped
 *
 * @param error
 */
exports.wrapErrorIfNeeded = wrapErrorIfNeeded;
const catchAndWrapError = error => Promise.reject(wrapErrorIfNeeded(error));
exports.catchAndWrapError = catchAndWrapError;