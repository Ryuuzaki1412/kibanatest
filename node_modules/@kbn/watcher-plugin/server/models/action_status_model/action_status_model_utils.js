"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deriveState = void 0;
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deriveState = serverActionStatusModel => {
  const {
    actionStatusJson,
    isLastExecutionSuccessful,
    lastCheckedRawFormat,
    lastExecutionRawFormat,
    errors,
    lastAcknowledged,
    lastExecution,
    lastThrottled,
    lastSuccessfulExecution
  } = serverActionStatusModel;
  const ackState = actionStatusJson.ack.state;
  if (isLastExecutionSuccessful === false && lastCheckedRawFormat === lastExecutionRawFormat) {
    return _constants.ACTION_STATES.ERROR;
  }
  if (errors) {
    return _constants.ACTION_STATES.CONFIG_ERROR;
  }
  if (ackState === 'awaits_successful_execution') {
    return _constants.ACTION_STATES.OK;
  }
  if (lastExecution) {
    // Might be null
    if (lastAcknowledged) {
      // Might be null
      if (ackState === 'acked' && lastAcknowledged >= lastExecution) {
        return _constants.ACTION_STATES.ACKNOWLEDGED;
      }

      // A user could potentially land in this state if running on multiple nodes and timing is off
      if (ackState === 'acked' && lastAcknowledged < lastExecution) {
        return _constants.ACTION_STATES.ERROR;
      }
    }
    if (lastThrottled) {
      // Might be null
      if (ackState === 'ackable' && lastThrottled >= lastExecution) {
        return _constants.ACTION_STATES.THROTTLED;
      }
    }
    if (lastSuccessfulExecution) {
      // Might be null
      if (ackState === 'ackable' && lastSuccessfulExecution >= lastExecution) {
        return _constants.ACTION_STATES.OK;
      }
      if (ackState === 'ackable' && lastSuccessfulExecution < lastExecution) {
        return _constants.ACTION_STATES.ERROR;
      }
    }
  }

  // At this point, we cannot determine the action status so mark it as "unknown".
  // We should never get to this point in the code. If we do, it means we are
  // missing an action status and the logic to determine it.
  return _constants.ACTION_STATES.UNKNOWN;
};
exports.deriveState = deriveState;