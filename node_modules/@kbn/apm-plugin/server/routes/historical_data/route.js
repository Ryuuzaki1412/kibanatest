"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historicalDataRouteRepository = void 0;
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _has_historical_agent_data = require("./has_historical_agent_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hasDataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/has_data',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const hasData = await (0, _has_historical_agent_data.hasHistoricalAgentData)(apmEventClient);
    return {
      hasData
    };
  }
});
const historicalDataRouteRepository = hasDataRoute;
exports.historicalDataRouteRepository = historicalDataRouteRepository;