"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _api_routes = require("../../api_routes");
var _errors = require("../../../file_share_service/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'delete';
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
    await fileService.asCurrentUser().deleteShareObject({
      id
    });
  } catch (e) {
    if (e instanceof _errors.FileShareNotFoundError) {
      return res.notFound({
        body: {
          message: e.message
        }
      });
    }
    throw e;
  }
  const body = {
    ok: true
  };
  return res.ok({
    body
  });
};
exports.handler = handler;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.share) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getUnshareRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.share.tags
      }
    }, handler);
  }
}