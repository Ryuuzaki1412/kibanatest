"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INTERNAL_BASE_STACK_CONNECTORS_API_PATH = exports.AdditionalEmailServices = void 0;
Object.defineProperty(exports, "OpsgenieConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _opsgenie.OpsgenieConnectorTypeId;
  }
});
Object.defineProperty(exports, "OpsgenieSubActions", {
  enumerable: true,
  get: function () {
    return _opsgenie.OpsgenieSubActions;
  }
});
var _opsgenie = require("./opsgenie");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// supported values for `service` in addition to nodemailer's list of well-known services
let AdditionalEmailServices;
exports.AdditionalEmailServices = AdditionalEmailServices;
(function (AdditionalEmailServices) {
  AdditionalEmailServices["ELASTIC_CLOUD"] = "elastic_cloud";
  AdditionalEmailServices["EXCHANGE"] = "exchange_server";
  AdditionalEmailServices["OTHER"] = "other";
})(AdditionalEmailServices || (exports.AdditionalEmailServices = AdditionalEmailServices = {}));
const INTERNAL_BASE_STACK_CONNECTORS_API_PATH = '/internal/stack_connectors';
exports.INTERNAL_BASE_STACK_CONNECTORS_API_PATH = INTERNAL_BASE_STACK_CONNECTORS_API_PATH;