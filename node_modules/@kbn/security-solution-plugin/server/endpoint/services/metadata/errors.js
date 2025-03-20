"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetEndpointPackagePolicyNotFoundError = exports.FleetAgentPolicyNotFoundError = exports.FleetAgentNotFoundError = exports.EndpointHostUnEnrolledError = exports.EndpointHostNotFoundError = void 0;
var _errors = require("../../errors");
var _errors2 = require("../../../../common/endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class EndpointHostNotFoundError extends _errors.NotFoundError {}
exports.EndpointHostNotFoundError = EndpointHostNotFoundError;
class EndpointHostUnEnrolledError extends _errors2.EndpointError {}
exports.EndpointHostUnEnrolledError = EndpointHostUnEnrolledError;
class FleetAgentNotFoundError extends _errors.NotFoundError {}
exports.FleetAgentNotFoundError = FleetAgentNotFoundError;
class FleetAgentPolicyNotFoundError extends _errors.NotFoundError {}
exports.FleetAgentPolicyNotFoundError = FleetAgentPolicyNotFoundError;
class FleetEndpointPackagePolicyNotFoundError extends _errors.NotFoundError {}
exports.FleetEndpointPackagePolicyNotFoundError = FleetEndpointPackagePolicyNotFoundError;