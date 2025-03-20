"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotFoundError = exports.EndpointAuthorizationError = exports.EndpointAppContentServicesNotStartedError = exports.EndpointAppContentServicesNotSetUpError = void 0;
var _errors = require("../../common/endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class NotFoundError extends _errors.EndpointError {}
exports.NotFoundError = NotFoundError;
class EndpointAppContentServicesNotSetUpError extends _errors.EndpointError {
  constructor() {
    super('EndpointAppContextService has not been set up (EndpointAppContextService.setup())');
  }
}
exports.EndpointAppContentServicesNotSetUpError = EndpointAppContentServicesNotSetUpError;
class EndpointAppContentServicesNotStartedError extends _errors.EndpointError {
  constructor() {
    super('EndpointAppContextService has not been started (EndpointAppContextService.start())');
  }
}
exports.EndpointAppContentServicesNotStartedError = EndpointAppContentServicesNotStartedError;
class EndpointAuthorizationError extends _errors.EndpointError {
  constructor(meta) {
    super('Endpoint authorization failure', meta);
  }
}
exports.EndpointAuthorizationError = EndpointAuthorizationError;