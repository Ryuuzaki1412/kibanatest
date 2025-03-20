"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionListClient = void 0;
var _error_with_status_code = require("../../error_with_status_code");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionListClient = async context => {
  var _await$context$lists;
  const exceptionLists = (_await$context$lists = await context.lists) === null || _await$context$lists === void 0 ? void 0 : _await$context$lists.getExceptionListClient();
  if (exceptionLists == null) {
    throw new _error_with_status_code.ErrorWithStatusCode('Exception lists is not found as a plugin', 404);
  } else {
    return exceptionLists;
  }
};
exports.getExceptionListClient = getExceptionListClient;