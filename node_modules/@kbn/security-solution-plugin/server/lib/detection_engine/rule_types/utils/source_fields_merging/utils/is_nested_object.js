"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNestedObject = void 0;
var _fp = require("lodash/fp");
var _is_type_object = require("./is_type_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns true if the first value is object-like but does not contain the shape of
 * a "type object" such as geo point, then it makes an assumption everything is objectlike
 * and not "type object" for all the array values. This should be used only for checking
 * for nested object types within fields.
 * @param fieldsValue The value to check if the first element is object like or not
 * @returns True if this is a nested object, otherwise false.
 */
const isNestedObject = fieldsValue => {
  return (0, _fp.isObjectLike)(fieldsValue[0]) && !(0, _is_type_object.isTypeObject)(fieldsValue);
};
exports.isNestedObject = isNestedObject;