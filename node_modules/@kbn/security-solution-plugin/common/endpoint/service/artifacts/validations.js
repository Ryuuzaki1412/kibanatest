"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidHash = exports.getDuplicateFields = void 0;
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const HASH_LENGTHS = [32,
// MD5
40,
// SHA1
64 // SHA256
];

const INVALID_CHARACTERS_PATTERN = /[^0-9a-f]/i;
const isValidHash = value => HASH_LENGTHS.includes(value.length) && !INVALID_CHARACTERS_PATTERN.test(value);
exports.isValidHash = isValidHash;
const getDuplicateFields = entries => {
  const groupedFields = new Map();
  entries.forEach(entry => {
    // With the move to the Exception Lists api, the server side now validates individual
    // `process.hash.[type]`'s, so we need to account for that here
    const field = entry.field.startsWith('process.hash') ? _securitysolutionUtils.ConditionEntryField.HASH : entry.field;
    groupedFields.set(field, [...(groupedFields.get(field) || []), entry]);
  });
  return [...groupedFields.entries()].filter(entry => entry[1].length > 1).map(entry => entry[0]);
};
exports.getDuplicateFields = getDuplicateFields;