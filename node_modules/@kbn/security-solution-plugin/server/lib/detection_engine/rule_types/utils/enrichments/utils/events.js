"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldValue = exports.getEventValue = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getEventValue = (event, path) => {
  var _event$_source;
  const value = (0, _lodash.get)(event, `_source.${path}`) || (event === null || event === void 0 ? void 0 : (_event$_source = event._source) === null || _event$_source === void 0 ? void 0 : _event$_source[path]);
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};
exports.getEventValue = getEventValue;
const getFieldValue = (event, path) => {
  var _get;
  return (_get = (0, _lodash.get)(event === null || event === void 0 ? void 0 : event.fields, path)) === null || _get === void 0 ? void 0 : _get[0];
};
exports.getFieldValue = getFieldValue;