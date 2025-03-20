"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHighPrecision = toHighPrecision;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SIX_DIGITS = 1000000;
function toHighPrecision(value) {
  return Math.round(value * SIX_DIGITS) / SIX_DIGITS;
}