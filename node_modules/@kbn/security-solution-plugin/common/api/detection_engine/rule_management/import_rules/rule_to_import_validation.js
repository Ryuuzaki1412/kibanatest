"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRuleToImport = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Additional validation that is implemented outside of the schema itself.
 */
const validateRuleToImport = rule => {
  return [...validateTimelineId(rule), ...validateTimelineTitle(rule), ...validateThreshold(rule)];
};
exports.validateRuleToImport = validateRuleToImport;
const validateTimelineId = rule => {
  if (rule.timeline_id != null) {
    if (rule.timeline_title == null) {
      return ['when "timeline_id" exists, "timeline_title" must also exist'];
    } else if (rule.timeline_id === '') {
      return ['"timeline_id" cannot be an empty string'];
    } else {
      return [];
    }
  }
  return [];
};
const validateTimelineTitle = rule => {
  if (rule.timeline_title != null) {
    if (rule.timeline_id == null) {
      return ['when "timeline_title" exists, "timeline_id" must also exist'];
    } else if (rule.timeline_title === '') {
      return ['"timeline_title" cannot be an empty string'];
    } else {
      return [];
    }
  }
  return [];
};
const validateThreshold = rule => {
  const errors = [];
  if (rule.type === 'threshold') {
    var _rule$threshold$cardi;
    if ((_rule$threshold$cardi = rule.threshold.cardinality) !== null && _rule$threshold$cardi !== void 0 && _rule$threshold$cardi.length && rule.threshold.field.includes(rule.threshold.cardinality[0].field)) {
      errors.push('Cardinality of a field that is being aggregated on is always 1');
    }
    if (Array.isArray(rule.threshold.field) && rule.threshold.field.length > 3) {
      errors.push('Number of fields must be 3 or less');
    }
  }
  return errors;
};