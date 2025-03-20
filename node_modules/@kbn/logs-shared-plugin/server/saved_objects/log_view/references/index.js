"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveLogViewSavedObjectReferences = exports.extractLogViewSavedObjectReferences = void 0;
var _references = require("../../references");
var _log_indices = require("./log_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const extractLogViewSavedObjectReferences = (0, _references.extractSavedObjectReferences)([_log_indices.extractLogIndicesSavedObjectReferences]);
exports.extractLogViewSavedObjectReferences = extractLogViewSavedObjectReferences;
const resolveLogViewSavedObjectReferences = (0, _references.resolveSavedObjectReferences)([_log_indices.resolveLogIndicesSavedObjectReferences]);
exports.resolveLogViewSavedObjectReferences = resolveLogViewSavedObjectReferences;