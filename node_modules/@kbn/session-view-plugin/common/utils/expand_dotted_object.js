"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandDottedObject = void 0;
var _std = require("@kbn/std");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const expandDottedField = (dottedFieldName, val) => {
  const parts = dottedFieldName.split('.');
  if (parts.length === 1) {
    return {
      [parts[0]]: val
    };
  } else {
    return {
      [parts[0]]: expandDottedField(parts.slice(1).join('.'), val)
    };
  }
};

/*
 * Expands an object with "dotted" fields to a nested object with unflattened fields.
 *
 * Example:
 *   expandDottedObject({
 *     "kibana.alert.depth": 1,
 *     "kibana.alert.ancestors": [{
 *       id: "d5e8eb51-a6a0-456d-8a15-4b79bfec3d71",
 *       type: "event",
 *       index: "signal_index",
 *       depth: 0,
 *     }],
 *   })
 *
 *   => {
 *     kibana: {
 *       alert: {
 *         ancestors: [
 *           id: "d5e8eb51-a6a0-456d-8a15-4b79bfec3d71",
 *           type: "event",
 *           index: "signal_index",
 *           depth: 0,
 *         ],
 *         depth: 1,
 *       },
 *     },
 *   }
 */
const expandDottedObject = dottedObj => {
  return Object.entries(dottedObj).reduce((acc, [key, val]) => (0, _std.merge)(acc, expandDottedField(key, val)), {});
};
exports.expandDottedObject = expandDottedObject;