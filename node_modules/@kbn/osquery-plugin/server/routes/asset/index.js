"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAssetRoutes = void 0;
var _get_assets_status_route = require("./get_assets_status_route");
var _update_assets_route = require("./update_assets_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initAssetRoutes = (router, context) => {
  (0, _get_assets_status_route.getAssetsStatusRoute)(router, context);
  (0, _update_assets_route.updateAssetsRoute)(router, context);
};
exports.initAssetRoutes = initAssetRoutes;