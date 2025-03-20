"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineMerge = void 0;
var _deepmerge = _interopRequireDefault(require("deepmerge"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// https://www.npmjs.com/package/deepmerge#arraymerge-example-combine-arrays
// @ts-expect-error update types
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  // @ts-expect-error update types
  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = (0, _deepmerge.default)(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};
exports.combineMerge = combineMerge;