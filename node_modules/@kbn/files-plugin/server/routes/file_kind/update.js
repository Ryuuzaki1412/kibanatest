"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _api_routes = require("../api_routes");
var _helpers = require("./helpers");
var commonSchemas = _interopRequireWildcard(require("../common_schemas"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'patch';
exports.method = method;
const rt = {
  body: _configSchema.schema.object({
    name: _configSchema.schema.maybe(commonSchemas.fileName),
    alt: _configSchema.schema.maybe(commonSchemas.fileAlt),
    meta: _configSchema.schema.maybe(commonSchemas.fileMeta)
  }),
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
    },
    body: attrs
  } = req;
  const {
    error,
    result: file
  } = await (0, _helpers.getById)(fileService.asCurrentUser(), id, fileKind);
  if (error) return error;
  await file.update(attrs);
  const body = {
    file: file.toJSON()
  };
  return res.ok({
    body
  });
};
exports.handler = handler;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.update) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getUpdateRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.update.tags
      }
    }, handler);
  }
}