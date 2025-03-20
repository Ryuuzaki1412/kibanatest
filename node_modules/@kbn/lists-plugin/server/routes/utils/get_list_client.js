"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListClient = void 0;
var _error_with_status_code = require("../../error_with_status_code");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getListClient = async context => {
  var _await$context$lists;
  const lists = (_await$context$lists = await context.lists) === null || _await$context$lists === void 0 ? void 0 : _await$context$lists.getListClient();
  if (lists == null) {
    throw new _error_with_status_code.ErrorWithStatusCode('Lists is not found as a plugin', 404);
  } else {
    return lists;
  }
};
exports.getListClient = getListClient;