"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwDryRunError = exports.DryRunError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Error instance that has properties: errorCode & statusCode to use within run_dry
 * errorCode({@link BulkActionsDryRunErrCode}) is used to categorize error and make possible to handle it later
 */
class DryRunError extends Error {
  constructor(message, errorCode, statusCode) {
    super(message);
    (0, _defineProperty2.default)(this, "errorCode", void 0);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.name = 'BulkActionDryRunError';
    this.errorCode = errorCode;
    this.statusCode = statusCode !== null && statusCode !== void 0 ? statusCode : 500;
  }
}

/**
 * executes function, if error thrown, wraps this error into {@link DryRunError}
 * @param executor - function that can be executed
 * @param errorCode - enum error code {@link BulkActionsDryRunErrCode} to use in DryRunError wrapper
 */
exports.DryRunError = DryRunError;
const throwDryRunError = async (executor, errorCode) => {
  try {
    await executor();
  } catch (e) {
    throw new DryRunError(e.message, errorCode, e.statusCode);
  }
};
exports.throwDryRunError = throwDryRunError;