"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidInternalManifestError = void 0;
var _errors = require("../../../../common/endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Indicates that the internal manifest that is managed by ManifestManager is invalid or contains
 * invalid data
 */
class InvalidInternalManifestError extends _errors.EndpointError {}
exports.InvalidInternalManifestError = InvalidInternalManifestError;