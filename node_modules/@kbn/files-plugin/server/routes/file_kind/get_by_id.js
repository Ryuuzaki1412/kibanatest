"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _api_routes = require("../api_routes");
var _helpers = require("./helpers");
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
  files,
  fileKind
}, req, res) => {
  const {
    fileService
  } = await files;
  const {
    params: {
      id
    }
  } = req;
  const {
    error,
    result: file
  } = await (0, _helpers.getById)(fileService.asCurrentUser(), id, fileKind);
  if (error) return error;
  const body = {
    file: file.toJSON()
  };
  return res.ok({
    body
  });
};
exports.handler = handler;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.getById) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getByIdRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.getById.tags
      }
    }, handler);
  }
}