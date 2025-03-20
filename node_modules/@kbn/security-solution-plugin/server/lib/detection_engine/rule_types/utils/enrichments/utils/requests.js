"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeSingleFieldMatchQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const makeSingleFieldMatchQuery = ({
  values,
  searchByField
}) => {
  const shouldClauses = values.map(value => ({
    match: {
      [searchByField]: {
        query: value,
        minimum_should_match: 1
      }
    }
  }));
  return {
    meta: {
      alias: null,
      negate: false,
      disabled: false
    },
    query: {
      bool: {
        should: shouldClauses,
        minimum_should_match: 1
      }
    }
  };
};
exports.makeSingleFieldMatchQuery = makeSingleFieldMatchQuery;