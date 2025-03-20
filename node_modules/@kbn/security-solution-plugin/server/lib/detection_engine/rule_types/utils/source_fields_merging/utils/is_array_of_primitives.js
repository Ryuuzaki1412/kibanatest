"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArrayOfPrimitives = void 0;
var _is_primitive = require("./is_primitive");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns true if this is an array and all elements of the array are primitives and not objects
 * @param valueInMergedDocument The search type to check if everything is primitive or not
 * @returns true if is an array and everything in the array is a primitive type
 */
const isArrayOfPrimitives = valueInMergedDocument => {
  return Array.isArray(valueInMergedDocument) && valueInMergedDocument.every(value => (0, _is_primitive.isPrimitive)(value));
};
exports.isArrayOfPrimitives = isArrayOfPrimitives;