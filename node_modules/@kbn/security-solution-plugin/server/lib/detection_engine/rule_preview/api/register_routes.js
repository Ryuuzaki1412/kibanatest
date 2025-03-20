"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRulePreviewRoutes = void 0;
var _route = require("./preview_rules/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRulePreviewRoutes = (router, config, ml, security, ruleOptions, securityRuleTypeOptions, previewRuleDataClient, getStartServices, logger) => {
  (0, _route.previewRulesRoute)(router, config, ml, security, ruleOptions, securityRuleTypeOptions, previewRuleDataClient, getStartServices, logger);
};
exports.registerRulePreviewRoutes = registerRulePreviewRoutes;