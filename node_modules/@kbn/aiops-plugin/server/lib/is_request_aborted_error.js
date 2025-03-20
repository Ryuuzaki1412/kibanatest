"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRequestAbortedError = isRequestAbortedError;
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isRequestAbortedError(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['name']) && arg.name === 'RequestAbortedError';
}