"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recursiveUnboxingFields = void 0;
var _fp = require("lodash/fp");
var _fp2 = require("@kbn/safer-lodash-set/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Recursively unboxes fields from an array when it is common sense to unbox them and safe to
 * make an assumption to unbox them when we compare them to the "fieldsValue" and the "valueInMergedDocument"
 *
 * NOTE: We use "typeof fieldsValue === 'object' && fieldsValue != null" instead of lodash "objectLike"
 * so that we can do type narrowing into an object to get the keys from it.
 *
 * @param fieldsValue The fields value that contains the nested field or not.
 * @param valueInMergedDocument The document to compare against fields value to see if it is also an array or not
 * @returns The unboxed fields if any
 */
const recursiveUnboxingFields = (fieldsValue, valueInMergedDocument) => {
  if (Array.isArray(fieldsValue)) {
    const fieldsValueMapped = fieldsValue.map((value, index) => {
      if (Array.isArray(valueInMergedDocument)) {
        return recursiveUnboxingFields(value, valueInMergedDocument[index]);
      } else {
        return recursiveUnboxingFields(value, undefined);
      }
    });
    if (fieldsValueMapped.length === 1) {
      if (Array.isArray(valueInMergedDocument)) {
        return fieldsValueMapped;
      } else {
        return fieldsValueMapped[0];
      }
    } else {
      return fieldsValueMapped;
    }
  } else if (typeof fieldsValue === 'object' && fieldsValue != null) {
    const reducedFromKeys = Object.keys(fieldsValue).reduce((accum, key) => {
      const recursed = recursiveUnboxingFields((0, _fp.get)(key, fieldsValue), (0, _fp.get)(key, valueInMergedDocument));
      return (0, _fp2.set)(key, recursed, accum);
    }, {});
    return reducedFromKeys;
  } else {
    return fieldsValue;
  }
};
exports.recursiveUnboxingFields = recursiveUnboxingFields;