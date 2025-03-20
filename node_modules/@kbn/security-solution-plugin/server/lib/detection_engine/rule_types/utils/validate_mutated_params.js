"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateIndexPatterns = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateIndexPatterns = indices => {
  if ((indices === null || indices === void 0 ? void 0 : indices.length) === 0) {
    throw new Error("Index patterns can't be empty");
  }
};
exports.validateIndexPatterns = validateIndexPatterns;