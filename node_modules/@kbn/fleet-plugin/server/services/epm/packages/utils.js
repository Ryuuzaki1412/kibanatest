"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withPackageSpan = void 0;
var _apmUtils = require("@kbn/apm-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const withPackageSpan = (stepName, func) => (0, _apmUtils.withSpan)({
  name: stepName,
  type: 'package'
}, func);
exports.withPackageSpan = withPackageSpan;