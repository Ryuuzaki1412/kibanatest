"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingBuiltinsPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rule_types = require("./rule_types");
var _feature = require("./feature");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AlertingBuiltinsPlugin {
  constructor(ctx) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = ctx.logger.get();
  }
  setup(core, {
    alerting,
    features
  }) {
    features.registerKibanaFeature(_feature.BUILT_IN_ALERTS_FEATURE);
    (0, _rule_types.registerBuiltInRuleTypes)({
      logger: this.logger,
      data: core.getStartServices().then(async ([, {
        triggersActionsUi
      }]) => triggersActionsUi.data),
      alerting,
      core
    });
  }
  start() {}
  stop() {}
}
exports.AlertingBuiltinsPlugin = AlertingBuiltinsPlugin;