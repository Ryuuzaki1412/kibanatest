"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerManageExceptionsRoutes = void 0;
var _route = require("./manage_exceptions/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerManageExceptionsRoutes = router => {
  (0, _route.createSharedExceptionListRoute)(router);
};
exports.registerManageExceptionsRoutes = registerManageExceptionsRoutes;