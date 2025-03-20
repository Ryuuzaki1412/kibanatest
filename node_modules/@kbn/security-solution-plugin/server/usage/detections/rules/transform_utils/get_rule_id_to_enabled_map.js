"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleIdToEnabledMap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const getRuleIdToEnabledMap = legacyRuleActions => {
  return legacyRuleActions.reduce((cache, legacyNotificationsObject) => {
    const ruleRef = legacyNotificationsObject.references.find(reference => reference.name === 'alert_0' && reference.type === 'alert');
    if (ruleRef != null) {
      const enabled = legacyNotificationsObject.attributes.ruleThrottle !== 'no_actions';
      cache.set(ruleRef.id, {
        enabled
      });
    }
    return cache;
  }, new Map());
};
exports.getRuleIdToEnabledMap = getRuleIdToEnabledMap;