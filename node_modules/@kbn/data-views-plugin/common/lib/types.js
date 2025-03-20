"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ILLEGAL_CHARACTERS_VISIBLE = exports.ILLEGAL_CHARACTERS_KEY = exports.ILLEGAL_CHARACTERS = exports.CONTAINS_SPACES_KEY = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Error code for when an index pattern contains illegal characters
 */
const ILLEGAL_CHARACTERS_KEY = 'ILLEGAL_CHARACTERS';
/**
 * Error code for when an index pattern contains spaces
 */
exports.ILLEGAL_CHARACTERS_KEY = ILLEGAL_CHARACTERS_KEY;
const CONTAINS_SPACES_KEY = 'CONTAINS_SPACES';
/**
 * Characters disallowed in index patterns that are visible.
 */
exports.CONTAINS_SPACES_KEY = CONTAINS_SPACES_KEY;
const ILLEGAL_CHARACTERS_VISIBLE = ['\\', '/', '?', '"', '<', '>', '|'];
/**
 * All characters disallowed in index patterns.
 */
exports.ILLEGAL_CHARACTERS_VISIBLE = ILLEGAL_CHARACTERS_VISIBLE;
const ILLEGAL_CHARACTERS = ILLEGAL_CHARACTERS_VISIBLE.concat(' ');
exports.ILLEGAL_CHARACTERS = ILLEGAL_CHARACTERS;