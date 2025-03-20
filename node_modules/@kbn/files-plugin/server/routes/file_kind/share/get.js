"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../../file_share_service/errors");
var _api_routes = require("../../api_routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'get';
exports.method = method;
const rt = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  })
};
const handler = async ({
  files
}, req, res) => {
  const {
    fileService
  } = await files;
  const {
    params: {
      id
    }
  } = req;
  try {
    const body = {
      share: await fileService.asCurrentUser().getShareObject({
        id
      })
    };
    return res.ok({
      body
    });
  } catch (e) {
    if (e instanceof _errors.FileShareNotFoundError) {
      return res.notFound({
        body: {
          message: `File share with id "${id}" not found`
        }
      });
    }
    throw e;
  }
};
exports.handler = handler;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.share) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getGetShareRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.share.tags
      }
    }, handler);
  }
}