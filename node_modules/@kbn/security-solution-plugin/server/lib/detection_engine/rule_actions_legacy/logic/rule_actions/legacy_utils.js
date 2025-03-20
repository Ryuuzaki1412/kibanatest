"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyTransformLegacyRuleAlertActionToReference = exports.legacyTransformActionToReference = exports.legacyGetThrottleOptions = exports.legacyGetRuleReference = exports.legacyGetRuleActionsFromSavedObject = exports.legacyGetActionReference = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyGetThrottleOptions = (throttle = 'no_actions') => ({
  ruleThrottle: throttle !== null && throttle !== void 0 ? throttle : 'no_actions',
  alertThrottle: ['no_actions', 'rule'].includes(throttle !== null && throttle !== void 0 ? throttle : 'no_actions') ? null : throttle
});

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyGetThrottleOptions = legacyGetThrottleOptions;
const legacyGetRuleActionsFromSavedObject = (savedObject, logger) => {
  var _savedObject$attribut;
  const existingActions = (_savedObject$attribut = savedObject.attributes.actions) !== null && _savedObject$attribut !== void 0 ? _savedObject$attribut : [];
  // We have to serialize the action from the saved object references
  const actionsWithIdReplacedFromReference = existingActions.flatMap(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ({
    group,
    params,
    action_type_id,
    actionRef
  }) => {
    var _savedObject$referenc;
    const found = (_savedObject$referenc = savedObject.references) === null || _savedObject$referenc === void 0 ? void 0 : _savedObject$referenc.find(reference => actionRef === reference.name && reference.type === 'action');
    if (found) {
      return [{
        id: found.id,
        group,
        params,
        action_type_id
      }];
    } else {
      // We cannot find it so we return no actions. This line should not be reached.
      logger.error(['Security Solution notification (Legacy) Expected to find an action within the action reference of:', `${actionRef} inside of the references of ${savedObject.references} but did not. Skipping this action.`].join(''));
      return [];
    }
  });
  return {
    id: savedObject.id,
    actions: actionsWithIdReplacedFromReference,
    alertThrottle: savedObject.attributes.alertThrottle || null,
    ruleThrottle: savedObject.attributes.ruleThrottle == null || actionsWithIdReplacedFromReference.length === 0 ? 'no_actions' : savedObject.attributes.ruleThrottle
  };
};

/**
 * Given an id this returns a legacy rule reference.
 * @param id The id of the alert
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyGetRuleActionsFromSavedObject = legacyGetRuleActionsFromSavedObject;
const legacyGetRuleReference = id => ({
  id,
  type: 'alert',
  name: 'alert_0'
});

/**
 * Given an id this returns a legacy action reference.
 * @param id The id of the action
 * @param index The index of the action
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyGetRuleReference = legacyGetRuleReference;
const legacyGetActionReference = (id, index) => ({
  id,
  type: 'action',
  name: `action_${index}`
});

/**
 * Given an alertAction this returns a transformed legacy action as a reference.
 * @param alertAction The alertAction
 * @param index The index of the action
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyGetActionReference = legacyGetActionReference;
const legacyTransformActionToReference = (alertAction, index) => ({
  actionRef: `action_${index}`,
  group: alertAction.group,
  params: alertAction.params,
  action_type_id: alertAction.actionTypeId
});

/**
 * Given an alertAction this returns a transformed legacy action as a reference.
 * @param alertAction The alertAction
 * @param index The index of the action
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyTransformActionToReference = legacyTransformActionToReference;
const legacyTransformLegacyRuleAlertActionToReference = (alertAction, index) => ({
  actionRef: `action_${index}`,
  group: alertAction.group,
  params: alertAction.params,
  action_type_id: alertAction.action_type_id
});
exports.legacyTransformLegacyRuleAlertActionToReference = legacyTransformLegacyRuleAlertActionToReference;