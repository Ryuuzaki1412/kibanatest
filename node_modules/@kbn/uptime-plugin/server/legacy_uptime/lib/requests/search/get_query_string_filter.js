"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryStringFilter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getQueryStringFilter = query => {
  let queryString = query;
  if (hasReservedCharsF(query) && !includesOperator(query.toLowerCase())) {
    // if user doesn't specify any query string syntax we use wildcard by default
    queryString = `*${query}* or tags:${query}*`;
  }
  if (Number(query)) {
    queryString = `url.port:${query} or ${query}`;
  }
  return {
    query_string: {
      query: queryString,
      fields: ['monitor.id.text', 'monitor.name.text', 'url.full.text', 'synthetics.step.name', 'synthetics.journey.name']
    }
  };
};
exports.getQueryStringFilter = getQueryStringFilter;
const includesOperator = query => {
  return query.includes(' or ') || query.includes(' and ');
};

// check if it has reserved characters for query string syntax
const hasReservedCharsF = str => {
  const format = /^[a-zA-Z]+$/;
  return format.test(str);
};