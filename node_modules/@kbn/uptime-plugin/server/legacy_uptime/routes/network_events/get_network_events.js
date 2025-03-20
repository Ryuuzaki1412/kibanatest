"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNetworkEventsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createNetworkEventsRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.NETWORK_EVENTS,
  validate: {
    query: _configSchema.schema.object({
      checkGroup: _configSchema.schema.string(),
      stepIndex: _configSchema.schema.number()
    })
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    const {
      checkGroup,
      stepIndex
    } = request.query;
    const result = await libs.requests.getNetworkEvents({
      uptimeEsClient,
      checkGroup,
      stepIndex
    });
    return result;
  }
});
exports.createNetworkEventsRoute = createNetworkEventsRoute;