"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deriveState = exports.deriveLastExecution = exports.deriveComment = exports.deriveActionStatusTotals = void 0;
var _lodash = require("lodash");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Export for unit tests.
const deriveActionStatusTotals = actionStatuses => {
  const result = {};
  (0, _lodash.forEach)(_constants.ACTION_STATES, state => {
    result[state] = 0;
  });
  if (actionStatuses) {
    actionStatuses.forEach(actionStatus => {
      result[actionStatus.state] = result[actionStatus.state] + 1;
    });
  }
  return result;
};
exports.deriveActionStatusTotals = deriveActionStatusTotals;
const deriveLastExecution = actionStatuses => {
  const actionStatus = (0, _lodash.maxBy)(actionStatuses, 'lastExecution');
  if (actionStatus) {
    return actionStatus.lastExecution;
  }
};
exports.deriveLastExecution = deriveLastExecution;
const deriveState = (isActive, watchState, actionStatuses) => {
  if (!isActive) {
    return _constants.WATCH_STATES.INACTIVE;
  }
  if (watchState === 'failed') {
    return _constants.WATCH_STATES.ERROR;
  }
  const totals = deriveActionStatusTotals(actionStatuses);
  if (totals[_constants.ACTION_STATES.ERROR] > 0) {
    return _constants.WATCH_STATES.ERROR;
  }
  if (totals[_constants.ACTION_STATES.CONFIG_ERROR] > 0) {
    return _constants.WATCH_STATES.CONFIG_ERROR;
  }
  return _constants.WATCH_STATES.ACTIVE;
};
exports.deriveState = deriveState;
const deriveComment = (isActive, actionStatuses) => {
  const totals = deriveActionStatusTotals(actionStatuses);
  const totalActions = actionStatuses ? actionStatuses.length : 0;
  if (!isActive) {
    return _constants.WATCH_STATE_COMMENTS.OK;
  }
  if (totals[_constants.ACTION_STATES.ERROR] > 0) {
    return _constants.WATCH_STATE_COMMENTS.FAILING;
  }
  if (totals[_constants.ACTION_STATES.ACKNOWLEDGED] > 0 && totals[_constants.ACTION_STATES.ACKNOWLEDGED] === totalActions) {
    return _constants.WATCH_STATE_COMMENTS.ACKNOWLEDGED;
  }
  if (totals[_constants.ACTION_STATES.ACKNOWLEDGED] > 0 && totals[_constants.ACTION_STATES.ACKNOWLEDGED] < totalActions) {
    return _constants.WATCH_STATE_COMMENTS.PARTIALLY_ACKNOWLEDGED;
  }
  if (totals[_constants.ACTION_STATES.THROTTLED] > 0 && totals[_constants.ACTION_STATES.THROTTLED] === totalActions) {
    return _constants.WATCH_STATE_COMMENTS.THROTTLED;
  }
  if (totals[_constants.ACTION_STATES.THROTTLED] > 0 && totals[_constants.ACTION_STATES.THROTTLED] < totalActions) {
    return _constants.WATCH_STATE_COMMENTS.PARTIALLY_THROTTLED;
  }
  return _constants.WATCH_STATE_COMMENTS.OK;
};
exports.deriveComment = deriveComment;