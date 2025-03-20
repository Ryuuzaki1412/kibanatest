"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateMutatedRuleTypeParams = validateMutatedRuleTypeParams;
var _boom = _interopRequireDefault(require("@hapi/boom"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function validateMutatedRuleTypeParams(mutatedParams, origParams, validator) {
  if (!validator) {
    return mutatedParams;
  }
  try {
    if (validator.validateMutatedParams) {
      return validator.validateMutatedParams(mutatedParams, origParams);
    }
    return mutatedParams;
  } catch (err) {
    throw _boom.default.badRequest(`Mutated params invalid: ${err.message}`);
  }
}