"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotificationsPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _connectors_email_service_provider = require("./services/connectors_email_service_provider");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class NotificationsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "emailServiceProvider", void 0);
    this.emailServiceProvider = new _connectors_email_service_provider.EmailServiceProvider(initializerContext.config.get(), initializerContext.logger.get());
  }
  setup(_core, plugins) {
    this.emailServiceProvider.setup(plugins);
  }
  start(_core, plugins) {
    const emailStartContract = this.emailServiceProvider.start(plugins);
    return {
      ...emailStartContract
    };
  }
  stop() {}
}
exports.NotificationsPlugin = NotificationsPlugin;