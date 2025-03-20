"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
var _rule_type = require("./rule_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function register(params) {
  const {
    alerting,
    core
  } = params;
  alerting.registerType((0, _rule_type.getRuleType)(core));
}