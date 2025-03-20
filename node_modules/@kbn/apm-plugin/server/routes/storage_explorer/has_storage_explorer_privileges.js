"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasStorageExplorerPrivileges = hasStorageExplorerPrivileges;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function hasStorageExplorerPrivileges({
  context,
  apmEventClient
}) {
  const {
    indices: {
      transaction,
      span,
      metric,
      error
    }
  } = apmEventClient;
  const names = (0, _lodash.uniq)([transaction, span, metric, error].flatMap(indexPatternString => indexPatternString.split(',').map(indexPattern => indexPattern.trim())));
  const esClient = (await context.core).elasticsearch.client;
  const {
    index,
    cluster
  } = await esClient.asCurrentUser.security.hasPrivileges({
    body: {
      index: [{
        names,
        privileges: ['monitor']
      }],
      cluster: ['monitor']
    }
  });
  const hasPrivileges = cluster.monitor && (0, _lodash.every)(index, 'monitor');
  return hasPrivileges;
}