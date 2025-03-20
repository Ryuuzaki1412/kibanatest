"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKueryFields = getKueryFields;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getKueryFields(nodes) {
  const allFields = nodes.map(node => {
    const {
      arguments: [fieldNameArg]
    } = node;
    if (fieldNameArg.type === 'function') {
      return getKueryFields(node.arguments);
    }
    return fieldNameArg.value;
  }).flat();
  return (0, _lodash.compact)(allFields);
}