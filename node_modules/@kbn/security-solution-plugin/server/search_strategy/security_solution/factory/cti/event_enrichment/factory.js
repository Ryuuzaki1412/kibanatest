"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventEnrichment = void 0;
var _query = require("./query");
var _response = require("./response");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const eventEnrichment = {
  buildDsl: _query.buildEventEnrichmentQuery,
  parse: _response.parseEventEnrichmentResponse
};
exports.eventEnrichment = eventEnrichment;