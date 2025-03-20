"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timestampFromStringRT = exports.timeRangeRT = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
var _moment = _interopRequireDefault(require("moment"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const timestampFromStringRT = new rt.Type('timestampFromStringRT', input => typeof input === 'number', (input, context) => (0, _pipeable.pipe)(rt.string.validate(input, context), (0, _Either.chain)(stringInput => {
  const momentValue = _moment.default.utc(stringInput);
  return momentValue.isValid() ? rt.success(momentValue.valueOf()) : rt.failure(stringInput, context);
})), output => new Date(output).toISOString());
exports.timestampFromStringRT = timestampFromStringRT;
const timeRangeRT = rt.type({
  min: timestampFromStringRT,
  max: timestampFromStringRT
});
exports.timeRangeRT = timeRangeRT;