"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.termQuery = termQuery;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function termQuery(field, value) {
  if ((0, _lodash.isNil)(value) || (0, _lodash.isEmpty)(value)) {
    return [];
  }
  return [{
    term: {
      [field]: value
    }
  }];
}