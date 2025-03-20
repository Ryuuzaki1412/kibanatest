"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedObjectNamePatternForExceptionsList = void 0;
var _constants = require("./constants");
var _get_saved_object_name_pattern = require("./get_saved_object_name_pattern");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given an index this will return the pattern of "exceptionsList_${index}"
 * @param index The index to suffix the string
 * @returns The pattern of "exceptionsList_${index}"
 * @throws TypeError if index is less than zero
 */
const getSavedObjectNamePatternForExceptionsList = index => {
  if (!(index >= 0)) {
    throw new TypeError(`"index" should alway be >= 0 instead of: ${index}`);
  } else {
    return (0, _get_saved_object_name_pattern.getSavedObjectNamePattern)({
      name: _constants.EXCEPTIONS_SAVED_OBJECT_REFERENCE_NAME,
      index
    });
  }
};
exports.getSavedObjectNamePatternForExceptionsList = getSavedObjectNamePatternForExceptionsList;