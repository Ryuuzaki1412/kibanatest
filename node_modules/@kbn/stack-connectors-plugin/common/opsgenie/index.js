"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RULE_TAGS_TEMPLATE = exports.OpsgenieSubActions = exports.OpsgenieConnectorTypeId = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let OpsgenieSubActions;
exports.OpsgenieSubActions = OpsgenieSubActions;
(function (OpsgenieSubActions) {
  OpsgenieSubActions["CreateAlert"] = "createAlert";
  OpsgenieSubActions["CloseAlert"] = "closeAlert";
})(OpsgenieSubActions || (exports.OpsgenieSubActions = OpsgenieSubActions = {}));
const RULE_TAGS_TEMPLATE = `{{rule.tags}}`;
exports.RULE_TAGS_TEMPLATE = RULE_TAGS_TEMPLATE;
const OpsgenieConnectorTypeId = '.opsgenie';
exports.OpsgenieConnectorTypeId = OpsgenieConnectorTypeId;