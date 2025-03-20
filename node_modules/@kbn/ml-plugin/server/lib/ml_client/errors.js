"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MLModelNotFound = exports.MLJobNotFound = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class MLJobNotFound extends Error {
  constructor(message) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", 404);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
exports.MLJobNotFound = MLJobNotFound;
class MLModelNotFound extends Error {
  constructor(message) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", 404);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
exports.MLModelNotFound = MLModelNotFound;