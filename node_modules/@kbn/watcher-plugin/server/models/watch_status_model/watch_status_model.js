"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildServerWatchStatusModel = exports.buildClientWatchStatusModel = void 0;
var _boom = require("@hapi/boom");
var _i18n = require("@kbn/i18n");
var _get_moment = require("../../../common/lib/get_moment");
var _action_status_model = require("../action_status_model");
var _watch_status_model_utils = require("./watch_status_model_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildServerWatchStatusModel = watchStatusModelEs => {
  var _watchStatusJson$acti;
  const {
    id,
    watchStatusJson,
    state,
    watchErrors
  } = watchStatusModelEs;

  // TODO: Remove once all consumers and upstream dependencies are converted to TS.
  if (!id) {
    throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watchStatus.idPropertyMissingBadRequestMessage', {
      defaultMessage: 'JSON argument must contain an id property'
    }));
  }

  // TODO: Remove once all consumers and upstream dependencies are converted to TS.
  if (!watchStatusJson) {
    throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watchStatus.watchStatusJsonPropertyMissingBadRequestMessage', {
      defaultMessage: 'JSON argument must contain a watchStatusJson property'
    }));
  }
  const actionStatuses = Object.keys((_watchStatusJson$acti = watchStatusJson.actions) !== null && _watchStatusJson$acti !== void 0 ? _watchStatusJson$acti : {}).map(actionStatusId => {
    const actionStatusJson = watchStatusJson.actions[actionStatusId];
    return (0, _action_status_model.buildServerActionStatusModel)({
      id: actionStatusId,
      actionStatusJson,
      errors: (watchErrors === null || watchErrors === void 0 ? void 0 : watchErrors.actions) && watchErrors.actions[actionStatusId],
      lastCheckedRawFormat: watchStatusJson.last_checked
    });
  });
  return {
    id,
    watchState: state,
    watchStatusJson,
    watchErrors: watchErrors !== null && watchErrors !== void 0 ? watchErrors : {},
    isActive: Boolean(watchStatusJson.state.active),
    lastChecked: (0, _get_moment.getMoment)(watchStatusJson.last_checked),
    lastMetCondition: (0, _get_moment.getMoment)(watchStatusJson.last_met_condition),
    actionStatuses
  };
};
exports.buildServerWatchStatusModel = buildServerWatchStatusModel;
const buildClientWatchStatusModel = serverWatchStatusModel => {
  var _actionStatuses$map;
  const {
    id,
    isActive,
    watchState,
    lastChecked,
    lastMetCondition,
    actionStatuses
  } = serverWatchStatusModel;
  const clientActionStatuses = (_actionStatuses$map = actionStatuses === null || actionStatuses === void 0 ? void 0 : actionStatuses.map(actionStatus => (0, _action_status_model.buildClientActionStatusModel)(actionStatus))) !== null && _actionStatuses$map !== void 0 ? _actionStatuses$map : [];
  return {
    id,
    isActive,
    lastChecked,
    lastMetCondition,
    state: (0, _watch_status_model_utils.deriveState)(isActive, watchState, clientActionStatuses),
    comment: (0, _watch_status_model_utils.deriveComment)(isActive, clientActionStatuses),
    lastExecution: (0, _watch_status_model_utils.deriveLastExecution)(clientActionStatuses),
    actionStatuses: clientActionStatuses
  };
};
exports.buildClientWatchStatusModel = buildClientWatchStatusModel;