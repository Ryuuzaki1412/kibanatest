"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DETECTION_ENGINE_RULES_EXCEPTIONS_REFERENCE_URL = exports.CREATE_RULE_EXCEPTIONS_URL = void 0;
var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INTERNAL_RULES_URL = `${_constants.INTERNAL_DETECTION_ENGINE_URL}/rules`;
const CREATE_RULE_EXCEPTIONS_URL = `${_constants.DETECTION_ENGINE_RULES_URL}/{id}/exceptions`;
exports.CREATE_RULE_EXCEPTIONS_URL = CREATE_RULE_EXCEPTIONS_URL;
const DETECTION_ENGINE_RULES_EXCEPTIONS_REFERENCE_URL = `${INTERNAL_RULES_URL}/exceptions/_find_references`;
exports.DETECTION_ENGINE_RULES_EXCEPTIONS_REFERENCE_URL = DETECTION_ENGINE_RULES_EXCEPTIONS_REFERENCE_URL;