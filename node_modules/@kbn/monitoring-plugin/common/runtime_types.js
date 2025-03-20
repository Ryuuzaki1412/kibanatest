"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatErrors = void 0;
var _ioTs = require("io-ts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getErrorPath = ([first, ...rest]) => {
  if (typeof first === 'undefined') {
    return [];
  } else if (first.type instanceof _ioTs.IntersectionType) {
    const [, ...next] = rest;
    return getErrorPath(next);
  } else if (first.type instanceof _ioTs.UnionType) {
    const [, ...next] = rest;
    return [first.key, ...getErrorPath(next)];
  }
  return [first.key, ...getErrorPath(rest)];
};
const getErrorType = ({
  context
}) => {
  var _context$type$name, _context, _context$type;
  return (_context$type$name = (_context = context[context.length - 1]) === null || _context === void 0 ? void 0 : (_context$type = _context.type) === null || _context$type === void 0 ? void 0 : _context$type.name) !== null && _context$type$name !== void 0 ? _context$type$name : 'unknown';
};
const formatError = error => {
  var _error$message;
  return (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : `in ${getErrorPath(error.context).join('/')}: ${JSON.stringify(error.value)} does not match expected type ${getErrorType(error)}`;
};
const formatErrors = errors => `Failed to validate: \n${errors.map(error => `  ${formatError(error)}`).join('\n')}`;
exports.formatErrors = formatErrors;