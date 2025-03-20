"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createValidationFunction = void 0;
var _Either = require("fp-ts/lib/Either");
var _pipeable = require("fp-ts/lib/pipeable");
var _runtime_types = require("../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createValidationFunction = runtimeType => (inputValue, {
  badRequest,
  ok
}) => (0, _pipeable.pipe)(runtimeType.decode(inputValue), (0, _Either.fold)(errors => badRequest((0, _runtime_types.formatErrors)(errors)), result => ok(result)));
exports.createValidationFunction = createValidationFunction;