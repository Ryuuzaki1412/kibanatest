"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLiveQueryRoutes = void 0;
var _create_live_query_route = require("./create_live_query_route");
var _get_live_query_details_route = require("./get_live_query_details_route");
var _get_live_query_results_route = require("./get_live_query_results_route");
var _find_live_query_route = require("./find_live_query_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initLiveQueryRoutes = (router, context) => {
  (0, _find_live_query_route.findLiveQueryRoute)(router);
  (0, _create_live_query_route.createLiveQueryRoute)(router, context);
  (0, _get_live_query_details_route.getLiveQueryDetailsRoute)(router);
  (0, _get_live_query_results_route.getLiveQueryResultsRoute)(router);
};
exports.initLiveQueryRoutes = initLiveQueryRoutes;