"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../../file_share_service/errors");
var _api_routes = require("../../api_routes");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'post';
exports.method = method;
const nameRegex = /^[a-z0-9-_]+$/i;
const rt = {
  params: _configSchema.schema.object({
    fileId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    validUntil: _configSchema.schema.maybe(_configSchema.schema.number()),
    name: _configSchema.schema.maybe(_configSchema.schema.string({
      maxLength: 256,
      validate: v => nameRegex.test(v) ? undefined : 'Only alphanumeric, "-" and "_" characters are allowed.'
    }))
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
      fileId
    },
    body: {
      validUntil,
      name
    }
  } = req;
  const {
    error,
    result: file
  } = await (0, _helpers.getById)(fileService.asCurrentUser(), fileId, fileKind);
  if (error) return error;
  try {
    const share = await file.share({
      name,
      validUntil
    });
    const body = {
      id: share.id,
      created: share.created,
      fileId: share.fileId,
      token: share.token,
      validUntil: share.validUntil,
      name: share.name
    };
    return res.ok({
      body
    });
  } catch (e) {
    if (e instanceof _errors.ExpiryDateInThePastError) {
      return res.badRequest({
        body: e
      });
    }
    throw e;
  }
};
exports.handler = handler;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.share) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getShareRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.share.tags
      }
    }, handler);
  }
}