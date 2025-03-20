"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFlattenedFields = getFlattenedFields;
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _fp = require("lodash/fp");
var _to_array = require("../../../common/utils/to_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getFlattenedFields(fields, hitFields, fieldMap, parentField) {
  return fields.reduce((flattenedFields, fieldName) => {
    const fieldPath = `${fieldName}`;
    const esField = (0, _fp.get)(`${parentField !== null && parentField !== void 0 ? parentField : ''}['${fieldName}']`, fieldMap);
    if (!(0, _fp.isEmpty)(esField)) {
      const fieldValue = (0, _fp.get)(`${parentField !== null && parentField !== void 0 ? parentField : ''}['${esField}']`, hitFields);
      if (!(0, _fp.isEmpty)(fieldValue)) {
        return (0, _saferLodashSet.set)(flattenedFields, fieldPath, (0, _to_array.toObjectArrayOfStrings)(fieldValue).map(({
          str
        }) => str));
      }
    }
    return flattenedFields;
  }, {});
}