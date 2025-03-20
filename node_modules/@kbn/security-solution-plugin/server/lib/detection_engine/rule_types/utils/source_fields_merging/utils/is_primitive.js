"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPrimitive = void 0;
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns true if it is a primitive type, otherwise false
 */
const isPrimitive = valueInMergedDocument => {
  return !(0, _fp.isObjectLike)(valueInMergedDocument);
};
exports.isPrimitive = isPrimitive;