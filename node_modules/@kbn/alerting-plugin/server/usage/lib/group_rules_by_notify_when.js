"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupRulesByNotifyWhen = groupRulesByNotifyWhen;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function groupRulesByNotifyWhen(rulesByNotifyWhen) {
  var _rulesByNotifyWhen$on, _rulesByNotifyWhen$on2, _rulesByNotifyWhen$on3;
  return {
    on_action_group_change: (_rulesByNotifyWhen$on = rulesByNotifyWhen.onActionGroupChange) !== null && _rulesByNotifyWhen$on !== void 0 ? _rulesByNotifyWhen$on : 0,
    on_active_alert: (_rulesByNotifyWhen$on2 = rulesByNotifyWhen.onActiveAlert) !== null && _rulesByNotifyWhen$on2 !== void 0 ? _rulesByNotifyWhen$on2 : 0,
    on_throttle_interval: (_rulesByNotifyWhen$on3 = rulesByNotifyWhen.onThrottleInterval) !== null && _rulesByNotifyWhen$on3 !== void 0 ? _rulesByNotifyWhen$on3 : 0
  };
}