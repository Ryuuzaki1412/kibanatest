"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertMetricValue = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Some metrics in the UI are in a different unit that what we store in ES.
const convertMetricValue = (metric, value) => {
  if (converters[metric]) {
    return converters[metric](value);
  } else {
    return value;
  }
};
exports.convertMetricValue = convertMetricValue;
const converters = {
  cpu: n => Number(n) / 100,
  memory: n => Number(n) / 100
};