"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCrossClusterSearch = isCrossClusterSearch;
var _indices_stats_helpers = require("./indices_stats_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isCrossClusterSearch(apmEventClient) {
  // Check if a remote cluster is set in APM indices
  return (0, _indices_stats_helpers.getApmIndicesCombined)(apmEventClient).includes(':');
}