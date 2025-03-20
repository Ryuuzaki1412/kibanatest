"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortWithExcludesAtEnd = exports.ensurePatternFormat = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
const sortWithExcludesAtEnd = indices => {
  const allSorted = indices.reduce((acc, index) => index.trim().startsWith('-') ? {
    includes: acc.includes,
    excludes: [...acc.excludes, index]
  } : {
    includes: [...acc.includes, index],
    excludes: acc.excludes
  }, {
    includes: [],
    excludes: []
  });
  return [...allSorted.includes.sort(), ...allSorted.excludes.sort()];
};
exports.sortWithExcludesAtEnd = sortWithExcludesAtEnd;
const ensurePatternFormat = patternList => sortWithExcludesAtEnd([...new Set(patternList.reduce((acc, pattern) => [...pattern.split(','), ...acc], []))]);
exports.ensurePatternFormat = ensurePatternFormat;