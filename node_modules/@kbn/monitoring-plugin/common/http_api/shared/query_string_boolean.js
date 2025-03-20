"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.booleanFromStringRT = void 0;
var _Either = require("fp-ts/lib/Either");
var _pipeable = require("fp-ts/lib/pipeable");
var rt = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const booleanFromStringRT = new rt.Type('BooleanFromString', rt.boolean.is, (value, context) => (0, _pipeable.pipe)(rt.string.validate(value, context), (0, _Either.chain)(stringValue => stringValue === 'true' ? rt.success(true) : stringValue === 'false' ? rt.success(false) : rt.failure(value, context))), String);
exports.booleanFromStringRT = booleanFromStringRT;