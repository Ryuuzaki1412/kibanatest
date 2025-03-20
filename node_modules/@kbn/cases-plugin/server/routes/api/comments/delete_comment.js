"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCommentRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
var _create_cases_route = require("../create_cases_route");
var _error = require("../../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteCommentRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'delete',
  path: _constants.CASE_COMMENT_DETAILS_URL,
  params: {
    params: _configSchema.schema.object({
      case_id: _configSchema.schema.string(),
      comment_id: _configSchema.schema.string()
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
      await client.attachments.delete({
        attachmentID: request.params.comment_id,
        caseID: request.params.case_id
      });
      return response.noContent();
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to delete comment in route case id: ${request.params.case_id} comment id: ${request.params.comment_id}: ${error}`,
        error
      });
    }
  }
});
exports.deleteCommentRoute = deleteCommentRoute;