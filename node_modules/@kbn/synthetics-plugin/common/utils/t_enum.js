"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tEnum = tEnum;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This utility function can be used to turn a TypeScript enum into a io-ts codec.
 *
 * @example
 * import { PathReporter } from "io-ts/lib/PathReporter";
 *
 * enum Thing {
 *  FOO = "foo",
 *  BAR = "bar"
 * }
 *
 * const ThingCodec = tEnum<Thing>("Thing", Thing);
 *
 * console.log(PathReporter.report(ThingCodec.decode('invalidvalue')));
 * // prints [ 'Invalid value "invalidvalue" supplied to : Thing' ]
 * console.log(PathReporter.report(ThingCodec.decode('foo')));
 * // prints [ 'No errors!' ]
 */
function tEnum(enumName, theEnum) {
  const isEnumValue = input => Object.values(theEnum).includes(input);
  return new t.Type(enumName, isEnumValue, (input, context) => isEnumValue(input) ? t.success(input) : t.failure(input, context), t.identity);
}