"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MTTR = void 0;
var _authorization = require("../../../authorization");
var _error = require("../../../common/error");
var _utils = require("../../utils");
var _all_cases_aggregation_handler = require("../all_cases_aggregation_handler");
var _avg_duration = require("./aggregations/avg_duration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class MTTR extends _all_cases_aggregation_handler.AllCasesAggregationHandler {
  constructor(options) {
    super(options, new Map([['mttr', new _avg_duration.AverageDuration()]]));
  }
  async compute() {
    const {
      authorization,
      services: {
        caseService
      },
      logger
    } = this.options.clientArgs;
    try {
      const {
        filter: authorizationFilter
      } = await authorization.getAuthorizationFilter(_authorization.Operations.getCasesMetrics);
      const caseQueryOptions = (0, _utils.constructQueryOptions)({
        from: this.from,
        to: this.to,
        owner: this.owner,
        authorizationFilter
      });
      const aggregationsResponse = await caseService.executeAggregations({
        aggregationBuilders: this.aggregationBuilders,
        options: {
          filter: caseQueryOptions.filter
        }
      });
      return this.formatResponse(aggregationsResponse);
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to calculate average mttr: ${error}`,
        error,
        logger
      });
    }
  }
}
exports.MTTR = MTTR;