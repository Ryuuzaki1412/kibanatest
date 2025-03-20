"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
var _constants = require("../../common/constants");
var _api_routes = require("./api_routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'get';
const handler = async ({
  files
}, req, res) => {
  const {
    fileService
  } = await files;
  const body = await fileService.asCurrentUser().getUsageMetrics();
  return res.ok({
    body
  });
};
function register(router) {
  router[method]({
    path: _api_routes.FILES_API_ROUTES.metrics,
    validate: {},
    options: {
      tags: [`access:${_constants.FILES_MANAGE_PRIVILEGE}`]
    }
  }, handler);
}