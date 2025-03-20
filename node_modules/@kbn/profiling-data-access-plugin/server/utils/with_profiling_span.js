"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withProfilingSpan = withProfilingSpan;
var _apmUtils = require("@kbn/apm-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function withProfilingSpan(optionsOrName, cb) {
  const options = (0, _apmUtils.parseSpanOptions)(optionsOrName);
  const optionsWithDefaults = {
    ...(options.intercept ? {} : {
      type: 'plugin:profiling'
    }),
    ...options,
    labels: {
      plugin: 'profiling',
      ...options.labels
    }
  };
  return (0, _apmUtils.withSpan)(optionsWithDefaults, cb);
}