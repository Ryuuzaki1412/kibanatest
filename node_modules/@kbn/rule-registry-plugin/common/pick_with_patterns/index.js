"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickWithPatterns = pickWithPatterns;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function pickWithPatterns(map, ...patterns) {
  const allFields = Object.keys(map);
  const matchedFields = allFields.filter(field => patterns.some(pattern => {
    if (pattern === field) {
      return true;
    }
    const fieldParts = field.split('.');
    const patternParts = pattern.split('.');
    if (patternParts.indexOf('*') !== patternParts.length - 1) {
      return false;
    }
    return fieldParts.every((fieldPart, index) => {
      const patternPart = patternParts.length - 1 < index ? '*' : patternParts[index];
      return fieldPart === patternPart || patternPart === '*';
    });
  }));
  return (0, _lodash.pick)(map, matchedFields);
}