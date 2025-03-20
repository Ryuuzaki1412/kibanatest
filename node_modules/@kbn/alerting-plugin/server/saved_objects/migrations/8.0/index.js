"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations801 = exports.getMigrations800 = void 0;
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _constants = require("../constants");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function addThreatIndicatorPathToThreatMatchRules(doc) {
  var _doc$attributes$param;
  return (0, _utils.isSiemSignalsRuleType)(doc) && ((_doc$attributes$param = doc.attributes.params) === null || _doc$attributes$param === void 0 ? void 0 : _doc$attributes$param.type) === 'threat_match' && !doc.attributes.params.threatIndicatorPath ? {
    ...doc,
    attributes: {
      ...doc.attributes,
      params: {
        ...doc.attributes.params,
        threatIndicatorPath: _constants.FILEBEAT_7X_INDICATOR_PATH
      }
    }
  } : doc;
}
function addSecuritySolutionAADRuleTypes(doc) {
  const ruleType = doc.attributes.params.type;
  return (0, _utils.isSiemSignalsRuleType)(doc) && (0, _securitysolutionRules.isRuleType)(ruleType) ? {
    ...doc,
    attributes: {
      ...doc.attributes,
      alertTypeId: _securitysolutionRules.ruleTypeMappings[ruleType],
      enabled: false,
      params: {
        ...doc.attributes.params,
        outputIndex: ''
      }
    }
  } : doc;
}
function addSecuritySolutionAADRuleTypeTags(doc) {
  var _doc$attributes$tags, _doc$attributes$tags2;
  const ruleType = doc.attributes.params.type;
  return (0, _utils.isDetectionEngineAADRuleType)(doc) && (0, _securitysolutionRules.isRuleType)(ruleType) ? {
    ...doc,
    attributes: {
      ...doc.attributes,
      // If the rule is disabled at this point, then the rule has not been re-enabled after
      // running the 8.0.0 migrations. If `doc.attributes.scheduledTaskId` exists, then the
      // rule was enabled prior to running the migration. Thus we know we should add the
      // tag to indicate it was auto-disabled.
      tags: !doc.attributes.enabled && doc.attributes.scheduledTaskId ? [...((_doc$attributes$tags = doc.attributes.tags) !== null && _doc$attributes$tags !== void 0 ? _doc$attributes$tags : []), 'auto_disabled_8.0'] : (_doc$attributes$tags2 = doc.attributes.tags) !== null && _doc$attributes$tags2 !== void 0 ? _doc$attributes$tags2 : []
    }
  } : doc;
}

// This fixes an issue whereby metrics.alert.inventory.threshold rules had the
// group for actions incorrectly spelt as metrics.invenotry_threshold.fired vs metrics.inventory_threshold.fired
function fixInventoryThresholdGroupId(doc) {
  if (doc.attributes.alertTypeId === 'metrics.alert.inventory.threshold') {
    const {
      attributes: {
        actions
      }
    } = doc;
    const updatedActions = actions ? actions.map(action => {
      // Wrong spelling
      if (action.group === 'metrics.invenotry_threshold.fired') {
        return {
          ...action,
          group: 'metrics.inventory_threshold.fired'
        };
      } else {
        return action;
      }
    }) : [];
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        actions: updatedActions
      }
    };
  } else {
    return doc;
  }
}
const getMigrations800 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(addThreatIndicatorPathToThreatMatchRules, addSecuritySolutionAADRuleTypes, fixInventoryThresholdGroupId));
exports.getMigrations800 = getMigrations800;
const getMigrations801 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(addSecuritySolutionAADRuleTypeTags));
exports.getMigrations801 = getMigrations801;