"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyInjectRuleIdReferences = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

/**
 * This injects any legacy "id"'s from saved object reference and returns the "ruleAlertId" using the saved object reference. If for
 * some reason it is missing on saved object reference, we log an error about it and then take the last known good value from the "ruleId"
 *
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 * @param logger The kibana injected logger
 * @param ruleAlertId The alert id to merge the saved object reference from.
 * @param savedObjectReferences The saved object references which should contain a "ruleAlertId"
 * @returns The "ruleAlertId" with the saved object reference replacing any value in the saved object's id.
 */
const legacyInjectRuleIdReferences = ({
  logger,
  ruleAlertId,
  savedObjectReferences
}) => {
  const referenceFound = savedObjectReferences.find(reference => {
    return reference.name === 'alert_0';
  });
  if (referenceFound) {
    return referenceFound.id;
  } else {
    logger.error(['The saved object reference was not found for the "ruleAlertId" when we were expecting to find it. ', 'Kibana migrations might not have run correctly or someone might have removed the saved object references manually. ', 'Returning the last known good "ruleAlertId" which might not work. "ruleAlertId" with its id being returned is: ', ruleAlertId].join(''));
    return ruleAlertId;
  }
};
exports.legacyInjectRuleIdReferences = legacyInjectRuleIdReferences;