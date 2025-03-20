"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEmptyStrings = validateEmptyStrings;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function validateEmptyStrings(value) {
  if ((0, _lodash.isString)(value)) {
    if (value.trim() === '') {
      throw new Error(`value '' is not valid`);
    }
  } else if (Array.isArray(value)) {
    value.forEach(item => {
      validateEmptyStrings(item);
    });
  } else if ((0, _lodash.isObject)(value)) {
    (0, _lodash.keys)(value).forEach(key => {
      validateEmptyStrings((0, _lodash.get)(value, key));
    });
  }
}