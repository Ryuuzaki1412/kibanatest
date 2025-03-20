"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyKueries = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Extract a map's keys to an array, then map those keys to a string per key.
 * The strings contain all of the values chosen for the given field (which is also the key value).
 * Reduce the list of query strings to a singular string, with AND operators between.
 */

const stringifyKueries = (kueries, logicalANDForTag) => {
  const defaultCondition = 'OR';
  return Array.from(kueries.keys()).map(key => {
    var _kueries$get;
    let condition = defaultCondition;
    if (key === 'tags' && logicalANDForTag) {
      condition = 'AND';
    }
    const value = (_kueries$get = kueries.get(key)) === null || _kueries$get === void 0 ? void 0 : _kueries$get.filter(v => v !== '');
    if (!value || value.length === 0) return '';
    if (value.length === 1) {
      return isAlphaNumeric(value[0]) ? `${key}: ${value[0]}` : `${key}: "${value[0]}"`;
    }
    const values = value.map(v => isAlphaNumeric(v) ? v : `"${v}"`).join(` ${condition} `);
    return `${key}: (${values})`;
  }).reduce((prev, cur, index, array) => {
    if (array.length === 1 || index === 0) {
      return cur;
    } else if (cur === '') {
      return prev;
    } else if (prev === '' && !!cur) {
      return cur;
    }
    return `${prev} AND ${cur}`;
  }, '');
};
exports.stringifyKueries = stringifyKueries;
const isAlphaNumeric = str => {
  const format = /[ `!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~]/;
  return !format.test(str);
};