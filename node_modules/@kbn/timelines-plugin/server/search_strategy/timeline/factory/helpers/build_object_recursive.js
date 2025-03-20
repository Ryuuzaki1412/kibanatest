"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildObjectRecursive = void 0;
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _fp = require("lodash/fp");
var _to_array = require("../../../../../common/utils/to_array");
var _get_nested_parent_path = require("./get_nested_parent_path");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildObjectRecursive = (fieldPath, fields) => {
  var _get;
  const nestedParentPath = (0, _get_nested_parent_path.getNestedParentPath)(fieldPath, fields);
  if (!nestedParentPath) {
    return (0, _saferLodashSet.set)({}, fieldPath, (0, _to_array.toStringArray)((0, _fp.get)(fieldPath, fields)));
  }
  const subPath = fieldPath.replace(`${nestedParentPath}.`, '');
  const subFields = (_get = (0, _fp.get)(nestedParentPath, fields)) !== null && _get !== void 0 ? _get : [];
  return (0, _saferLodashSet.set)({}, nestedParentPath, subFields.map(subField => buildObjectRecursive(subPath, subField)));
};
exports.buildObjectRecursive = buildObjectRecursive;