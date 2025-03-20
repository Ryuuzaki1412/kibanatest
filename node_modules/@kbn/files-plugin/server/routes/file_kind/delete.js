"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _file = require("../../file");
var _api_routes = require("../api_routes");
var _helpers = require("./helpers");
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
  files,
  fileKind
}, req, res) => {
  const {
    params: {
      id
    }
  } = req;
  const {
    fileService
  } = await files;
  const {
    error,
    result: file
  } = await (0, _helpers.getById)(fileService.asCurrentUser(), id, fileKind);
  if (error) return error;
  try {
    await file.delete();
  } catch (e) {
    if (e instanceof _file.fileErrors.AlreadyDeletedError || e instanceof _file.fileErrors.UploadInProgressError) {
      return res.badRequest({
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
  if (fileKind.http.delete) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getDeleteRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.delete.tags
      }
    }, handler);
  }
}