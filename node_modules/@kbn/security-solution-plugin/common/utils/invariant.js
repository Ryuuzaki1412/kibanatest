"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvariantError = void 0;
exports.invariant = invariant;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class InvariantError extends Error {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "name", 'InvariantError');
  }
}

/**
 * Asserts that the provided condition is always true
 * and throws an invariant violation error otherwise
 *
 * @param condition Condition to assert
 * @param message Error message to throw if the condition is falsy
 */
exports.InvariantError = InvariantError;
function invariant(condition, message) {
  if (!condition) {
    throw new InvariantError(message);
  }
}