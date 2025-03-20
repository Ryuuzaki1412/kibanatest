"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupRulesByStatus = groupRulesByStatus;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function groupRulesByStatus(rulesByStatus) {
  const ok = rulesByStatus.ok || 0;
  const active = rulesByStatus.active || 0;
  return {
    success: ok + active,
    error: rulesByStatus.error || 0,
    warning: rulesByStatus.warning || 0
  };
}