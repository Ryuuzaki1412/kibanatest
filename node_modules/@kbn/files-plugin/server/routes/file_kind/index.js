"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFileKindRoutes = registerFileKindRoutes;
var _enhance_router = require("./enhance_router");
var create = _interopRequireWildcard(require("./create"));
var upload = _interopRequireWildcard(require("./upload"));
var update = _interopRequireWildcard(require("./update"));
var deleteEndpoint = _interopRequireWildcard(require("./delete"));
var list = _interopRequireWildcard(require("./list"));
var download = _interopRequireWildcard(require("./download"));
var getById = _interopRequireWildcard(require("./get_by_id"));
var share = _interopRequireWildcard(require("./share/share"));
var unshare = _interopRequireWildcard(require("./share/unshare"));
var listShare = _interopRequireWildcard(require("./share/list"));
var getShare = _interopRequireWildcard(require("./share/get"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Register a single file kind's routes
 */
function registerFileKindRoutes(router, fileKind) {
  const fileKindRouter = (0, _enhance_router.enhanceRouter)({
    router,
    fileKind: fileKind.id
  });
  [create, upload, update, deleteEndpoint, list, download, getById, share, unshare, getShare, listShare].forEach(route => {
    route.register(fileKindRouter, fileKind);
  });
}