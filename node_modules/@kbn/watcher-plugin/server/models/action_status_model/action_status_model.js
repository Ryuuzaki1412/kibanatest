"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildServerActionStatusModel = exports.buildClientActionStatusModel = void 0;
var _boom = require("@hapi/boom");
var _i18n = require("@kbn/i18n");
var _get_moment = require("../../../common/lib/get_moment");
var _action_status_model_utils = require("./action_status_model_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildServerActionStatusModel = actionStatusModelEs => {
  var _actionStatusJson$las, _actionStatusJson$las2, _actionStatusJson$las3, _actionStatusJson$las4, _actionStatusJson$las5, _actionStatusJson$las6;
  const {
    id,
    actionStatusJson,
    errors,
    lastCheckedRawFormat
  } = actionStatusModelEs;
  const missingPropertyError = missingProperty => _i18n.i18n.translate('xpack.watcher.models.actionStatus.actionStatusJsonPropertyMissingBadRequestMessage', {
    defaultMessage: 'JSON argument must contain an "{missingProperty}" property',
    values: {
      missingProperty
    }
  });

  // TODO: Remove once all consumers and upstream dependencies are converted to TS.
  if (!id) {
    throw (0, _boom.badRequest)(missingPropertyError('id'));
  }

  // TODO: Remove once all consumers and upstream dependencies are converted to TS.
  if (!actionStatusJson) {
    throw (0, _boom.badRequest)(missingPropertyError('actionStatusJson'));
  }
  return {
    id,
    actionStatusJson,
    errors,
    lastCheckedRawFormat,
    lastExecutionRawFormat: (_actionStatusJson$las = actionStatusJson.last_execution) === null || _actionStatusJson$las === void 0 ? void 0 : _actionStatusJson$las.timestamp,
    lastAcknowledged: (0, _get_moment.getMoment)(actionStatusJson.ack.timestamp),
    lastExecution: (0, _get_moment.getMoment)((_actionStatusJson$las2 = actionStatusJson.last_execution) === null || _actionStatusJson$las2 === void 0 ? void 0 : _actionStatusJson$las2.timestamp),
    isLastExecutionSuccessful: (_actionStatusJson$las3 = actionStatusJson.last_execution) === null || _actionStatusJson$las3 === void 0 ? void 0 : _actionStatusJson$las3.successful,
    lastExecutionReason: (_actionStatusJson$las4 = actionStatusJson.last_execution) === null || _actionStatusJson$las4 === void 0 ? void 0 : _actionStatusJson$las4.reason,
    lastThrottled: (0, _get_moment.getMoment)((_actionStatusJson$las5 = actionStatusJson.last_throttle) === null || _actionStatusJson$las5 === void 0 ? void 0 : _actionStatusJson$las5.timestamp),
    lastSuccessfulExecution: (0, _get_moment.getMoment)((_actionStatusJson$las6 = actionStatusJson.last_successful_execution) === null || _actionStatusJson$las6 === void 0 ? void 0 : _actionStatusJson$las6.timestamp)
  };
};
exports.buildServerActionStatusModel = buildServerActionStatusModel;
const buildClientActionStatusModel = serverActionStatusModel => {
  const {
    id,
    lastAcknowledged,
    lastThrottled,
    lastExecution,
    isLastExecutionSuccessful,
    lastExecutionReason,
    lastSuccessfulExecution
  } = serverActionStatusModel;
  const state = (0, _action_status_model_utils.deriveState)(serverActionStatusModel);
  const isAckable = serverActionStatusModel.actionStatusJson.ack.state === 'ackable';
  return {
    id,
    lastAcknowledged,
    lastThrottled,
    lastExecution,
    isLastExecutionSuccessful,
    lastExecutionReason,
    lastSuccessfulExecution,
    state,
    isAckable
  };
};
exports.buildClientActionStatusModel = buildClientActionStatusModel;