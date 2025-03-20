"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThresholdWithCardinality = exports.ThresholdNormalized = exports.Threshold = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Attributes specific to Threshold rules

const thresholdField = t.exact(t.type({
  field: t.union([t.string, t.array(t.string)]),
  // Covers pre- and post-7.12
  value: _securitysolutionIoTsTypes.PositiveIntegerGreaterThanZero
}));
const thresholdFieldNormalized = t.exact(t.type({
  field: t.array(t.string),
  value: _securitysolutionIoTsTypes.PositiveIntegerGreaterThanZero
}));
const thresholdCardinalityField = t.exact(t.type({
  field: t.string,
  value: _securitysolutionIoTsTypes.PositiveInteger
}));
const Threshold = t.intersection([thresholdField, t.exact(t.partial({
  cardinality: t.array(thresholdCardinalityField)
}))]);
exports.Threshold = Threshold;
const ThresholdNormalized = t.intersection([thresholdFieldNormalized, t.exact(t.partial({
  cardinality: t.array(thresholdCardinalityField)
}))]);
exports.ThresholdNormalized = ThresholdNormalized;
const ThresholdWithCardinality = t.intersection([thresholdFieldNormalized, t.exact(t.type({
  cardinality: t.array(thresholdCardinalityField)
}))]);
exports.ThresholdWithCardinality = ThresholdWithCardinality;