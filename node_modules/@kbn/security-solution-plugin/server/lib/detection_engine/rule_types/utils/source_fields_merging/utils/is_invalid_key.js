"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInvalidKey = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Matches any invalid keys from runtime fields such as runtime fields which can start with a
 * "." or runtime fields which can have ".." two or more dots.
 * @param fieldsKey The fields key to match against
 * @returns true if it is invalid key, otherwise false
 */
const isInvalidKey = fieldsKey => {
  return fieldsKey.startsWith('.') || fieldsKey.match(/[\.]{2,}/) != null;
};
exports.isInvalidKey = isInvalidKey;