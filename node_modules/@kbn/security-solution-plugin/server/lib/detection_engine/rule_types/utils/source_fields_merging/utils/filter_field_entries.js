"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterFieldEntries = void 0;
var _is_multifield = require("./is_multifield");
var _is_invalid_key = require("./is_invalid_key");
var _is_type_object = require("./is_type_object");
var _is_ignored = require("./is_ignored");
var _is_eql_bug_ = require("./is_eql_bug_77152");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Filters field entries by removing invalid field entries such as any invalid characters
 * in the keys or if there are sub-objects that are trying to override regular objects and
 * are invalid runtime field names. Also matches type objects such as geo-points and we ignore
 * those and don't try to merge those.
 *
 * @param fieldEntries The field entries to filter
 * @param ignoreFields Array of fields to ignore. If a value starts and ends with "/", such as: "/[_]+/" then the field will be treated as a regular expression.
 * If you have an object structure to ignore such as "{ a: { b: c: {} } } ", then you need to ignore it as the string "a.b.c"
 * @returns The field entries filtered
 */
const filterFieldEntries = (fieldEntries, ignoreFields) => {
  return fieldEntries.filter(([fieldsKey, fieldsValue]) => {
    return !(0, _is_eql_bug_.isEqlBug77152)(fieldsKey) && !(0, _is_ignored.isIgnored)(fieldsKey, ignoreFields) && !(0, _is_invalid_key.isInvalidKey)(fieldsKey) && !(0, _is_multifield.isMultiField)(fieldsKey, fieldEntries) && !(0, _is_type_object.isTypeObject)(fieldsValue) // TODO: Look at not filtering this and instead transform it so it can be inserted correctly in the strategies which does an overwrite of everything from fields
    ;
  });
};
exports.filterFieldEntries = filterFieldEntries;