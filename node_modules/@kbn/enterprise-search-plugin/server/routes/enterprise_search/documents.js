"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDocumentRoute = registerDocumentRoute;
var _configSchema = require("@kbn/config-schema");
var _error_codes = require("../../../common/types/error_codes");
var _get_document = require("../../lib/indices/document/get_document");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
var _identify_exceptions = require("../../utils/identify_exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerDocumentRoute({
  router,
  log
}) {
  router.get({
    path: '/internal/enterprise_search/indices/{index_name}/document/{document_id}',
    validate: {
      params: _configSchema.schema.object({
        document_id: _configSchema.schema.string(),
        index_name: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.index_name);
    const documentId = decodeURIComponent(request.params.document_id);
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const documentResponse = await (0, _get_document.getDocument)(client, indexName, documentId);
      return response.ok({
        body: documentResponse,
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      if ((0, _identify_exceptions.isNotFoundException)(error)) {
        return response.customError({
          body: {
            attributes: {
              error_code: _error_codes.ErrorCode.DOCUMENT_NOT_FOUND
            },
            message: `Could not find document ${documentId}`
          },
          statusCode: 404
        });
      } else {
        // otherwise, default handler
        throw error;
      }
    }
  }));
}