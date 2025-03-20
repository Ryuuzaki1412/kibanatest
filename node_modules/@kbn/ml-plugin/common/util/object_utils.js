"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirstKeyInObject = void 0;
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get the first key in the object
 * getFirstKeyInObject({ firstKey: {}, secondKey: {}}) -> firstKey
 */
const getFirstKeyInObject = arg => {
  if ((0, _mlIsPopulatedObject.isPopulatedObject)(arg)) {
    const keys = Object.keys(arg);
    return keys.length > 0 ? keys[0] : undefined;
  }
};
exports.getFirstKeyInObject = getFirstKeyInObject;