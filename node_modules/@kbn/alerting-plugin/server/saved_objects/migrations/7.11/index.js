"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnyActionSupportIncidents = exports.getMigrations7112 = exports.getMigrations7110 = void 0;
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SUPPORT_INCIDENTS_ACTION_TYPES = ['.servicenow', '.jira', '.resilient'];
const isAnyActionSupportIncidents = doc => doc.attributes.actions.some(action => SUPPORT_INCIDENTS_ACTION_TYPES.includes(action.actionTypeId));
exports.isAnyActionSupportIncidents = isAnyActionSupportIncidents;
function isEmptyObject(obj) {
  for (const attr in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, attr)) {
      return false;
    }
  }
  return true;
}
function setAlertUpdatedAtDate(doc) {
  const updatedAt = doc.updated_at || doc.attributes.createdAt;
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      updatedAt
    }
  };
}
function setNotifyWhen(doc) {
  const notifyWhen = doc.attributes.throttle ? 'onThrottleInterval' : 'onActiveAlert';
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      notifyWhen
    }
  };
}
function restructureConnectorsThatSupportIncident(doc) {
  const {
    actions
  } = doc.attributes;
  const newActions = actions.reduce((acc, action) => {
    if (['.servicenow', '.jira', '.resilient'].includes(action.actionTypeId) && action.params.subAction === 'pushToService') {
      var _incident, _action$params, _action$params$subAct;
      // Future developer, we needed to do that because when we created this migration
      // we forget to think about user already using 7.11.0 and having an incident attribute build the right way
      const subActionParamsIncident = (_incident = (_action$params = action.params) === null || _action$params === void 0 ? void 0 : (_action$params$subAct = _action$params.subActionParams) === null || _action$params$subAct === void 0 ? void 0 : _action$params$subAct.incident) !== null && _incident !== void 0 ? _incident : null;
      if (subActionParamsIncident != null && !isEmptyObject(subActionParamsIncident)) {
        return [...acc, action];
      }
      if (action.actionTypeId === '.servicenow') {
        const {
          title,
          comments,
          comment,
          description,
          severity,
          urgency,
          impact,
          short_description: shortDescription
        } = action.params.subActionParams;
        return [...acc, {
          ...action,
          params: {
            subAction: 'pushToService',
            subActionParams: {
              incident: {
                short_description: shortDescription !== null && shortDescription !== void 0 ? shortDescription : title,
                description,
                severity,
                urgency,
                impact
              },
              comments: [...(comments !== null && comments !== void 0 ? comments : []), ...(comment != null ? [{
                commentId: '1',
                comment
              }] : [])]
            }
          }
        }];
      } else if (action.actionTypeId === '.jira') {
        const {
          title,
          comments,
          description,
          issueType,
          priority,
          labels,
          parent,
          summary
        } = action.params.subActionParams;
        return [...acc, {
          ...action,
          params: {
            subAction: 'pushToService',
            subActionParams: {
              incident: {
                summary: summary !== null && summary !== void 0 ? summary : title,
                description,
                issueType,
                priority,
                labels,
                parent
              },
              comments
            }
          }
        }];
      } else if (action.actionTypeId === '.resilient') {
        const {
          title,
          comments,
          description,
          incidentTypes,
          severityCode,
          name
        } = action.params.subActionParams;
        return [...acc, {
          ...action,
          params: {
            subAction: 'pushToService',
            subActionParams: {
              incident: {
                name: name !== null && name !== void 0 ? name : title,
                description,
                incidentTypes,
                severityCode
              },
              comments
            }
          }
        }];
      }
    }
    return [...acc, action];
  }, []);
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      actions: newActions
    }
  };
}
const getMigrations7110 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(setAlertUpdatedAtDate, setNotifyWhen));
exports.getMigrations7110 = getMigrations7110;
const getMigrations7112 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => isAnyActionSupportIncidents(doc), (0, _utils.pipeMigrations)(restructureConnectorsThatSupportIncident));
exports.getMigrations7112 = getMigrations7112;