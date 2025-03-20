"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDataView = isDataView;
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Custom minimal type guard for DataView to check against the attributes used in transforms code.
function isDataView(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['title', 'fields']) &&
  // `getComputedFields` is inherited, so it's not possible to
  // check with `hasOwnProperty` which is used by isPopulatedObject()
  'getComputedFields' in arg && typeof arg.getComputedFields === 'function' && typeof arg.title === 'string' && Array.isArray(arg.fields);
}