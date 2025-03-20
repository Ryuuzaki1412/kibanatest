"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldValue = exports.getFieldPath = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getFieldPath = field => `chain.0.arguments.${field}.0`;
exports.getFieldPath = getFieldPath;
const getFieldValue = (ast, field, defaultValue) => {
  if (!ast) {
    return null;
  }
  return (0, _lodash.get)(ast, getFieldPath(field), defaultValue);
};
exports.getFieldValue = getFieldValue;