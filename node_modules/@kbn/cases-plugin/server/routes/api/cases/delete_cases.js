"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCaseRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
var _error = require("../../../common/error");
var _create_cases_route = require("../create_cases_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteCaseRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'delete',
  path: _constants.CASES_URL,
  params: {
    query: _configSchema.schema.object({
      ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
    })
  },
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const caseContext = await context.cases;
      const client = await caseContext.getCasesClient();
      await client.cases.delete(request.query.ids);
      return response.noContent();
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to delete cases in route ids: ${JSON.stringify(request.query.ids)}: ${error}`,
        error
      });
    }
  }
});
exports.deleteCaseRoute = deleteCaseRoute;