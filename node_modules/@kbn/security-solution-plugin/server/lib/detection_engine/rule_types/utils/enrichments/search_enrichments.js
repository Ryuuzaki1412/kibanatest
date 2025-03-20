"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchEnrichments = void 0;
var _get_query_filter = require("../get_query_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const searchEnrichments = async ({
  index,
  services,
  query,
  fields
}) => {
  try {
    const response = await services.scopedClusterClient.asCurrentUser.search({
      index,
      body: {
        _source: '',
        fields,
        query: (0, _get_query_filter.getQueryFilter)({
          query: '',
          language: 'kuery',
          filters: [query],
          index,
          exceptionFilter: undefined
        })
      },
      track_total_hits: false
    });
    return response.hits.hits;
  } catch (e) {
    return [];
  }
};
exports.searchEnrichments = searchEnrichments;