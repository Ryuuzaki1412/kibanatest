"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSecurityAppError = exports.isNotFoundError = exports.isKibanaError = exports.isAppError = void 0;
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isKibanaError = error => (0, _fp.has)('message', error) && (0, _fp.has)('body.message', error) && (0, _fp.has)('body.statusCode', error);
exports.isKibanaError = isKibanaError;
const isSecurityAppError = error => (0, _fp.has)('message', error) && (0, _fp.has)('body.message', error) && (0, _fp.has)('body.status_code', error);
exports.isSecurityAppError = isSecurityAppError;
const isAppError = error => isKibanaError(error) || isSecurityAppError(error);
exports.isAppError = isAppError;
const isNotFoundError = error => isKibanaError(error) && error.body.statusCode === 404 || isSecurityAppError(error) && error.body.status_code === 404;
exports.isNotFoundError = isNotFoundError;