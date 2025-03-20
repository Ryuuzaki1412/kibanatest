"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUpdateRuleProps = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Additional validation that is implemented outside of the schema itself.
 */
const validateUpdateRuleProps = props => {
  return [...validateId(props), ...validateTimelineId(props), ...validateTimelineTitle(props), ...validateThreshold(props)];
};
exports.validateUpdateRuleProps = validateUpdateRuleProps;
const validateId = props => {
  if (props.id != null && props.rule_id != null) {
    return ['both "id" and "rule_id" cannot exist, choose one or the other'];
  } else if (props.id == null && props.rule_id == null) {
    return ['either "id" or "rule_id" must be set'];
  } else {
    return [];
  }
};
const validateTimelineId = props => {
  if (props.timeline_id != null) {
    if (props.timeline_title == null) {
      return ['when "timeline_id" exists, "timeline_title" must also exist'];
    } else if (props.timeline_id === '') {
      return ['"timeline_id" cannot be an empty string'];
    } else {
      return [];
    }
  }
  return [];
};
const validateTimelineTitle = props => {
  if (props.timeline_title != null) {
    if (props.timeline_id == null) {
      return ['when "timeline_title" exists, "timeline_id" must also exist'];
    } else if (props.timeline_title === '') {
      return ['"timeline_title" cannot be an empty string'];
    } else {
      return [];
    }
  }
  return [];
};
const validateThreshold = props => {
  const errors = [];
  if (props.type === 'threshold') {
    if (!props.threshold) {
      errors.push('when "type" is "threshold", "threshold" is required');
    } else {
      var _props$threshold$card;
      if ((_props$threshold$card = props.threshold.cardinality) !== null && _props$threshold$card !== void 0 && _props$threshold$card.length && props.threshold.field.includes(props.threshold.cardinality[0].field)) {
        errors.push('Cardinality of a field that is being aggregated on is always 1');
      }
      if (Array.isArray(props.threshold.field) && props.threshold.field.length > 3) {
        errors.push('Number of fields must be 3 or less');
      }
    }
  }
  return errors;
};