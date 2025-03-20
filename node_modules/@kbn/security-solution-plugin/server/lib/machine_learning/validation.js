"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAuthzError = exports.throwAuthzError = exports.HttpAuthzError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class HttpAuthzError extends Error {
  constructor(message) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.name = 'HttpAuthzError';
    this.statusCode = 403;
  }
}
exports.HttpAuthzError = HttpAuthzError;
const toAuthzError = validation => {
  if (!validation.valid) {
    return new HttpAuthzError(validation.message);
  }
};
exports.toAuthzError = toAuthzError;
const throwAuthzError = validation => {
  const error = toAuthzError(validation);
  if (error) {
    throw error;
  }
};
exports.throwAuthzError = throwAuthzError;