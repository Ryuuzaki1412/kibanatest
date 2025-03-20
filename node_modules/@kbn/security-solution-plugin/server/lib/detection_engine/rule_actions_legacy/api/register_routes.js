"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLegacyRuleActionsRoutes = void 0;
var _route = require("./create_legacy_notification/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const registerLegacyRuleActionsRoutes = (router, logger) => {
  // Once we no longer have the legacy notifications system/"side car actions" this should be removed.
  (0, _route.legacyCreateLegacyNotificationRoute)(router, logger);
};
exports.registerLegacyRuleActionsRoutes = registerLegacyRuleActionsRoutes;