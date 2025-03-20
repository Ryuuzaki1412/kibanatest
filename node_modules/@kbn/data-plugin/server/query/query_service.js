"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryService = void 0;
var _saved_objects = require("../saved_objects");
var queryPersistableState = _interopRequireWildcard(require("../../common/query/persistable_state"));
var filtersPersistableState = _interopRequireWildcard(require("../../common/query/filters/persistable_state"));
var _routes = require("./routes");
var _route_handler_context = require("./route_handler_context");
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
 * @internal
 */
class QueryService {
  setup(core) {
    core.savedObjects.registerType(_saved_objects.querySavedObjectType);
    core.http.registerRouteHandlerContext('savedQuery', _route_handler_context.registerSavedQueryRouteHandlerContext);
    (0, _routes.registerSavedQueryRoutes)(core);
    return {
      extract: queryPersistableState.extract,
      inject: queryPersistableState.inject,
      telemetry: queryPersistableState.telemetry,
      getAllMigrations: queryPersistableState.getAllMigrations,
      filterManager: {
        extract: filtersPersistableState.extract,
        inject: filtersPersistableState.inject,
        telemetry: filtersPersistableState.telemetry,
        getAllMigrations: filtersPersistableState.getAllMigrations
      }
    };
  }
  start() {}
}
exports.QueryService = QueryService;