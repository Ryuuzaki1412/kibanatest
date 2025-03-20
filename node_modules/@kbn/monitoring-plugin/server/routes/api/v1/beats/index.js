"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerV1BeatsRoutes = registerV1BeatsRoutes;
var _beats = require("./beats");
var _beat_detail = require("./beat_detail");
var _overview = require("./overview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerV1BeatsRoutes(server) {
  (0, _beat_detail.beatsDetailRoute)(server);
  (0, _beats.beatsListingRoute)(server);
  (0, _overview.beatsOverviewRoute)(server);
}