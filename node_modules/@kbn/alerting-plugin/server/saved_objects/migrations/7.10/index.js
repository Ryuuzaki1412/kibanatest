"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations7100 = void 0;
var _constants = require("../constants");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const consumersToChange = new Map(Object.entries({
  alerting: 'alerts',
  metrics: 'infrastructure',
  [_constants.SIEM_APP_ID]: _constants.SIEM_SERVER_APP_ID
}));
function markAsLegacyAndChangeConsumer(doc) {
  var _consumersToChange$ge;
  const {
    attributes: {
      consumer
    }
  } = doc;
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      consumer: (_consumersToChange$ge = consumersToChange.get(consumer)) !== null && _consumersToChange$ge !== void 0 ? _consumersToChange$ge : consumer,
      // mark any alert predating 7.10 as a legacy alert
      meta: {
        versionApiKeyLastmodified: _constants.LEGACY_LAST_MODIFIED_VERSION
      }
    }
  };
}
function setAlertIdAsDefaultDedupkeyOnPagerDutyActions(doc) {
  const {
    attributes
  } = doc;
  return {
    ...doc,
    attributes: {
      ...attributes,
      ...(attributes.actions ? {
        actions: attributes.actions.map(action => {
          var _action$params$dedupK;
          if (action.actionTypeId !== '.pagerduty' || action.params.eventAction === 'trigger') {
            return action;
          }
          return {
            ...action,
            params: {
              ...action.params,
              dedupKey: (_action$params$dedupK = action.params.dedupKey) !== null && _action$params$dedupK !== void 0 ? _action$params$dedupK : '{{alertId}}'
            }
          };
        })
      } : {})
    }
  };
}
function initializeExecutionStatus(doc) {
  const {
    attributes
  } = doc;
  return {
    ...doc,
    attributes: {
      ...attributes,
      executionStatus: {
        status: 'pending',
        lastExecutionDate: new Date().toISOString(),
        error: null
      }
    }
  };
}
const getMigrations7100 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects,
// migrate all documents in 7.10 in order to add the "meta" RBAC field
doc => true, (0, _utils.pipeMigrations)(markAsLegacyAndChangeConsumer, setAlertIdAsDefaultDedupkeyOnPagerDutyActions, initializeExecutionStatus));
exports.getMigrations7100 = getMigrations7100;