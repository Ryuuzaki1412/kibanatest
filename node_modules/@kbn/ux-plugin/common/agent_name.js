"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RUM_AGENT_NAMES = void 0;
exports.isRumAgentName = isRumAgentName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RUM_AGENT_NAMES = ['js-base', 'rum-js', 'opentelemetry/webjs'];
exports.RUM_AGENT_NAMES = RUM_AGENT_NAMES;
function isRumAgentName(agentName) {
  return RUM_AGENT_NAMES.includes(agentName);
}