"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations830 = void 0;
var _lodash = require("lodash");
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function addSearchType(doc) {
  const searchType = doc.attributes.params.searchType;
  return (0, _utils.isEsQueryRuleType)(doc) && !searchType ? {
    ...doc,
    attributes: {
      ...doc.attributes,
      params: {
        ...doc.attributes.params,
        searchType: 'esQuery'
      }
    }
  } : doc;
}

/**
 * removes internal tags(starts with '__internal') from Security Solution rules
 * @param doc rule to be migrated
 * @returns migrated rule if it's Security Solution rule or unchanged if not
 */
function removeInternalTags(doc) {
  if (!(0, _utils.isDetectionEngineAADRuleType)(doc)) {
    return doc;
  }
  const {
    attributes: {
      tags
    }
  } = doc;
  const filteredTags = (tags !== null && tags !== void 0 ? tags : []).filter(tag => !tag.startsWith('__internal_'));
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      tags: filteredTags
    }
  };
}
function convertSnoozes(doc) {
  const {
    attributes: {
      snoozeEndTime
    }
  } = doc;
  return {
    ...doc,
    attributes: {
      ...(0, _lodash.omit)(doc.attributes, ['snoozeEndTime']),
      snoozeSchedule: snoozeEndTime ? [{
        duration: Date.parse(snoozeEndTime) - Date.now(),
        rRule: {
          dtstart: new Date().toISOString(),
          tzid: _momentTimezone.default.tz.guess(),
          count: 1
        }
      }] : []
    }
  };
}
const getMigrations830 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(addSearchType, removeInternalTags, convertSnoozes));
exports.getMigrations830 = getMigrations830;