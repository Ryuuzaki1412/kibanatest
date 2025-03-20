"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIKibanaSearchResponse = exports.EMBEDDABLE_SAMPLER_OPTION = void 0;
exports.isNoSamplingOption = isNoSamplingOption;
exports.isNormalSamplingOption = isNormalSamplingOption;
exports.isRandomSamplingOption = isRandomSamplingOption;
exports.isValidField = isValidField;
exports.isValidFieldStats = isValidFieldStats;
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isValidField(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['fieldName', 'type']) && typeof arg.fieldName === 'string';
}
const isIKibanaSearchResponse = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['rawResponse']);
};
exports.isIKibanaSearchResponse = isIKibanaSearchResponse;
function isValidFieldStats(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['fieldName', 'type', 'count']);
}
const EMBEDDABLE_SAMPLER_OPTION = {
  RANDOM: 'random_sampling',
  NORMAL: 'normal_sampling'
};
exports.EMBEDDABLE_SAMPLER_OPTION = EMBEDDABLE_SAMPLER_OPTION;
function isRandomSamplingOption(arg) {
  return arg.mode === 'random_sampling';
}
function isNormalSamplingOption(arg) {
  return arg.mode === 'normal_sampling';
}
function isNoSamplingOption(arg) {
  return arg.mode === 'no_sampling' || arg.mode === 'random_sampling' && arg.probability === 1;
}