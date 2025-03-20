"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlwaysShowAliases = exports.expandAliases = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAlwaysShowAliases = (indexAndAliasNames, alwaysShowNames) => {
  if (alwaysShowNames.length === 0) return [];
  // Only add the index and aliases that are not already included
  return alwaysShowNames.filter(name => !indexAndAliasNames.includes(name));
};
exports.getAlwaysShowAliases = getAlwaysShowAliases;
const expandAliases = (indexName, aliases, index, indicesData, alwaysShowPattern) => {
  const filteredAliases = alwaysShowPattern ? aliases.filter(alias => alias.startsWith(alwaysShowPattern.alias_pattern)) : aliases;
  return filteredAliases.map(alias => {
    var _indicesData$indexCou;
    return {
      alias: true,
      count: (_indicesData$indexCou = indicesData.indexCounts[alias]) !== null && _indicesData$indexCou !== void 0 ? _indicesData$indexCou : 0,
      name: alias,
      privileges: {
        manage: false,
        read: false,
        ...indicesData.indexPrivileges[indexName]
      },
      ...index
    };
  });
};
exports.expandAliases = expandAliases;