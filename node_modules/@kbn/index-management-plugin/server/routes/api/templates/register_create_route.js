"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = registerCreateRoute;
var _i18n = require("@kbn/i18n");
var _ = require("..");
var _validate_schemas = require("./validate_schemas");
var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bodySchema = _validate_schemas.templateSchema;
function registerCreateRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _.addBasePath)('/index_templates'),
    validate: {
      body: bodySchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const template = request.body;
    try {
      const {
        _kbnMeta: {
          isLegacy
        }
      } = template;

      // Check that template with the same name doesn't already exist
      const templateExists = await (0, _lib.doesTemplateExist)({
        name: template.name,
        client,
        isLegacy
      });
      if (templateExists) {
        return response.conflict({
          body: new Error(_i18n.i18n.translate('xpack.idxMgmt.createRoute.duplicateTemplateIdErrorMessage', {
            defaultMessage: "There is already a template with name '{name}'.",
            values: {
              name: template.name
            }
          }))
        });
      }

      // Otherwise create new index template
      const responseBody = await (0, _lib.saveTemplate)({
        template,
        client,
        isLegacy
      });
      return response.ok({
        body: responseBody
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}