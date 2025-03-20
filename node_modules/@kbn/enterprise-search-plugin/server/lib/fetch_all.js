"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAll = void 0;
var _utils = require("@opentelemetry/sdk-metrics-base/build/src/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO add safety to prevent an OOM error if the query results are too enough

const fetchAll = async (client, index, query) => {
  let hits = [];
  let accumulator = [];
  do {
    const connectorResult = await client.asCurrentUser.search({
      from: accumulator.length,
      index,
      query,
      size: 1000
    });
    hits = connectorResult.hits.hits;
    accumulator = accumulator.concat(hits);
  } while (hits.length >= 1000);
  return accumulator.map(({
    _source,
    _id
  }) => _source ? {
    ..._source,
    id: _id
  } : undefined).filter(_utils.isNotNullish);
};
exports.fetchAll = fetchAll;