"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTypeObject = void 0;
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns true if we match a "type" object which could be a geo-point when we are parsing field
 * values and we encounter a geo-point.
 * @param fieldsValue The value to test the shape of the data and see if it is a geo-point or not
 * @returns True if we match a geo-point or another type or not.
 */
const isTypeObject = fieldsValue => {
  return fieldsValue.some(value => {
    if (typeof value === 'object' && value != null) {
      return (0, _fp.get)('type', value);
    } else {
      return false;
    }
  });
};
exports.isTypeObject = isTypeObject;