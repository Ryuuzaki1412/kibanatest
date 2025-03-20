"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeKeywordPostfix = exports.isKeywordDuplicate = exports.hasKeywordDuplicate = exports.KEYWORD_POSTFIX = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const KEYWORD_POSTFIX = '.keyword';

// checks if fieldName has a `fieldName.keyword` equivalent in the set of all field names.
exports.KEYWORD_POSTFIX = KEYWORD_POSTFIX;
const hasKeywordDuplicate = (fieldName, fieldNamesSet) => fieldNamesSet.has(`${fieldName}${KEYWORD_POSTFIX}`);

// checks if a fieldName ends with `.keyword` and has a field name equivalent without the postfix in the set of all field names.
exports.hasKeywordDuplicate = hasKeywordDuplicate;
const isKeywordDuplicate = (fieldName, fieldNamesSet) => fieldName.endsWith(KEYWORD_POSTFIX) && fieldNamesSet.has(removeKeywordPostfix(fieldName));

// removes the `.keyword` postfix form a field name if applicable
exports.isKeywordDuplicate = isKeywordDuplicate;
const removeKeywordPostfix = fieldName => fieldName.replace(new RegExp(`${KEYWORD_POSTFIX}$`), '');
exports.removeKeywordPostfix = removeKeywordPostfix;