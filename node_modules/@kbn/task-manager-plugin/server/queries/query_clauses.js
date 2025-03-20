"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterDownBy = filterDownBy;
exports.matchesClauses = matchesClauses;
exports.mustBeAllOf = mustBeAllOf;
exports.shouldBeOneOf = shouldBeOneOf;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function matchesClauses(...clauses) {
  return {
    bool: Object.assign({}, ...clauses.map(clause => clause.bool))
  };
}
function shouldBeOneOf(...should) {
  return {
    bool: {
      should
    }
  };
}
function mustBeAllOf(...must) {
  return {
    bool: {
      must
    }
  };
}
function filterDownBy(...filter) {
  return {
    bool: {
      filter
    }
  };
}