"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Action = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _get_action_type = require("../../lib/get_action_type");
var _constants = require("../../constants");
var _logging_action = require("./logging_action");
var _email_action = require("./email_action");
var _slack_action = require("./slack_action");
var _index_action = require("./index_action");
var _webhook_action = require("./webhook_action");
var _pagerduty_action = require("./pagerduty_action");
var _jira_action = require("./jira_action");
var _unknown_action = require("./unknown_action");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ActionTypes = {};
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.LOGGING, _logging_action.LoggingAction);
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.EMAIL, _email_action.EmailAction);
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.SLACK, _slack_action.SlackAction);
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.INDEX, _index_action.IndexAction);
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.WEBHOOK, _webhook_action.WebhookAction);
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.PAGERDUTY, _pagerduty_action.PagerDutyAction);
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.JIRA, _jira_action.JiraAction);
(0, _saferLodashSet.set)(ActionTypes, _constants.ACTION_TYPES.UNKNOWN, _unknown_action.UnknownAction);
class Action {
  // From Elasticsearch
  static fromUpstreamJson(json) {
    const type = (0, _get_action_type.getActionType)(json.actionJson);
    const ActionType = ActionTypes[type] || _unknown_action.UnknownAction;
    const {
      action
    } = ActionType.fromUpstreamJson(json);
    return action;
  }

  // From Kibana
  static fromDownstreamJson(json) {
    const ActionType = ActionTypes[json.type] || _unknown_action.UnknownAction;
    const {
      action
    } = ActionType.fromDownstreamJson(json);
    return action;
  }
}
exports.Action = Action;
(0, _defineProperty2.default)(Action, "getActionTypes", () => {
  return ActionTypes;
});