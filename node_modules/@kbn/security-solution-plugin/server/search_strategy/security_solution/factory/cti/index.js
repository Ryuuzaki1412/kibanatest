"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ctiFactoryTypes = void 0;
var _cti = require("../../../../../common/search_strategy/security_solution/cti");
var _event_enrichment = require("./event_enrichment");
var _threat_intel_source = require("./threat_intel_source");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ctiFactoryTypes = {
  [_cti.CtiQueries.eventEnrichment]: _event_enrichment.eventEnrichment,
  [_cti.CtiQueries.dataSource]: _threat_intel_source.dataSource
};
exports.ctiFactoryTypes = ctiFactoryTypes;