"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildKueryNodeFilter = void 0;
var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildKueryNodeFilter = filter => {
  let optionsFilter = filter !== null && filter !== void 0 ? filter : null;
  try {
    if (optionsFilter != null && typeof optionsFilter === 'string') {
      // FUTURE ENGINEER -> if I can parse it that mean it is a KueryNode or it is a string
      optionsFilter = JSON.parse(optionsFilter);
    }
  } catch (e) {
    optionsFilter = filter !== null && filter !== void 0 ? filter : null;
  }
  return optionsFilter ? typeof optionsFilter === 'string' ? (0, _esQuery.fromKueryExpression)(optionsFilter) : optionsFilter : null;
};
exports.buildKueryNodeFilter = buildKueryNodeFilter;