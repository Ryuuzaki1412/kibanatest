"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJourneyRoute = exports.createJourneyFailedStepsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createJourneyRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.JOURNEY,
  validate: {
    params: _configSchema.schema.object({
      checkGroup: _configSchema.schema.string()
    }),
    query: _configSchema.schema.object({
      // provides a filter for the types of synthetic events to include
      // when fetching a journey's data
      syntheticEventTypes: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()]))
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      checkGroup
    } = request.params;
    const {
      syntheticEventTypes
    } = request.query;
    try {
      const [result, details] = await Promise.all([await libs.requests.getJourneySteps({
        uptimeEsClient,
        checkGroup,
        syntheticEventTypes
      }), await libs.requests.getJourneyDetails({
        uptimeEsClient,
        checkGroup
      })]);
      return {
        checkGroup,
        steps: result,
        details
      };
    } catch (e) {
      return response.custom({
        statusCode: 500,
        body: {
          message: e
        }
      });
    }
  }
});
exports.createJourneyRoute = createJourneyRoute;
const createJourneyFailedStepsRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.JOURNEY_FAILED_STEPS,
  validate: {
    query: _configSchema.schema.object({
      checkGroups: _configSchema.schema.arrayOf(_configSchema.schema.string())
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      checkGroups
    } = request.query;
    try {
      const result = await libs.requests.getJourneyFailedSteps({
        uptimeEsClient,
        checkGroups
      });
      return {
        checkGroups,
        steps: result
      };
    } catch (e) {
      return response.customError({
        statusCode: 500,
        body: e
      });
    }
  }
});
exports.createJourneyFailedStepsRoute = createJourneyFailedStepsRoute;