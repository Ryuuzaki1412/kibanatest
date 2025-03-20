"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALL_NAMESPACES = void 0;
exports.getByAlias = getByAlias;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * This is used for looking up function/argument definitions. It looks through
 * the given object/array for a case-insensitive match, which could be either the
 * `name` itself, or something under the `aliases` property.
 */

const ALL_NAMESPACES = '*';
exports.ALL_NAMESPACES = ALL_NAMESPACES;
function getByAlias(node, nodeName, nodeNamespace) {
  const lowerCaseName = nodeName.toLowerCase();
  return Object.values(node).find(({
    name,
    aliases,
    namespace
  }) => {
    if (!name) return false;
    if (name.toLowerCase() === lowerCaseName) {
      if (!namespace || nodeNamespace === ALL_NAMESPACES || namespace === nodeNamespace) {
        return true;
      }
    }
    return (aliases || []).some(alias => {
      return alias.toLowerCase() === lowerCaseName && (!namespace || nodeNamespace === ALL_NAMESPACES || namespace === nodeNamespace);
    });
  });
}