"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleMetrics = void 0;
var _update_usage = require("./update_usage");
var _get_detection_rules = require("../../queries/get_detection_rules");
var _get_alerts = require("../../queries/get_alerts");
var _constants = require("../../constants");
var _get_initial_usage = require("./get_initial_usage");
var _get_case_comments = require("../../queries/get_case_comments");
var _get_rule_id_to_cases_map = require("./transform_utils/get_rule_id_to_cases_map");
var _get_alert_id_to_count_map = require("./transform_utils/get_alert_id_to_count_map");
var _get_rule_id_to_enabled_map = require("./transform_utils/get_rule_id_to_enabled_map");
var _get_rule_object_correlations = require("./transform_utils/get_rule_object_correlations");
var _get_event_log_by_type_and_status = require("../../queries/get_event_log_by_type_and_status");
var _legacy_get_rule_actions = require("../../queries/legacy_get_rule_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const getRuleMetrics = async ({
  signalsIndex,
  esClient,
  savedObjectsClient,
  logger,
  eventLogIndex
}) => {
  try {
    // gets rule saved objects
    const ruleResults = await (0, _get_detection_rules.getDetectionRules)({
      savedObjectsClient,
      maxPerPage: _constants.MAX_PER_PAGE,
      maxSize: _constants.MAX_RESULTS_WINDOW,
      logger
    });

    // early return if we don't have any detection rules then there is no need to query anything else
    if (ruleResults.length === 0) {
      return {
        detection_rule_detail: [],
        detection_rule_usage: (0, _get_initial_usage.getInitialRulesUsage)(),
        detection_rule_status: (0, _get_initial_usage.getInitialEventLogUsage)()
      };
    }

    // gets the alerts data objects
    const detectionAlertsRespPromise = (0, _get_alerts.getAlerts)({
      esClient,
      signalsIndex: `${signalsIndex}*`,
      maxPerPage: _constants.MAX_PER_PAGE,
      maxSize: _constants.MAX_RESULTS_WINDOW,
      logger
    });

    // gets cases saved objects
    const caseCommentsPromise = (0, _get_case_comments.getCaseComments)({
      savedObjectsClient,
      maxSize: _constants.MAX_PER_PAGE,
      maxPerPage: _constants.MAX_RESULTS_WINDOW,
      logger
    });

    // gets the legacy rule actions to track legacy notifications.
    const legacyRuleActionsPromise = (0, _legacy_get_rule_actions.legacyGetRuleActions)({
      savedObjectsClient,
      maxSize: _constants.MAX_PER_PAGE,
      maxPerPage: _constants.MAX_RESULTS_WINDOW,
      logger
    });

    // gets the event log information by type and status
    const eventLogMetricsTypeStatusPromise = (0, _get_event_log_by_type_and_status.getEventLogByTypeAndStatus)({
      esClient,
      logger,
      eventLogIndex,
      ruleResults
    });
    const [detectionAlertsResp, caseComments, legacyRuleActions, eventLogMetricsTypeStatus] = await Promise.all([detectionAlertsRespPromise, caseCommentsPromise, legacyRuleActionsPromise, eventLogMetricsTypeStatusPromise]);

    // create in-memory maps for correlation
    const legacyNotificationRuleIds = (0, _get_rule_id_to_enabled_map.getRuleIdToEnabledMap)(legacyRuleActions);
    const casesRuleIds = (0, _get_rule_id_to_cases_map.getRuleIdToCasesMap)(caseComments);
    const alertsCounts = (0, _get_alert_id_to_count_map.getAlertIdToCountMap)(detectionAlertsResp);

    // correlate the rule objects to the results
    const rulesCorrelated = (0, _get_rule_object_correlations.getRuleObjectCorrelations)({
      ruleResults,
      legacyNotificationRuleIds,
      casesRuleIds,
      alertsCounts
    });

    // Only bring back rule detail on elastic prepackaged detection rules
    const elasticRuleObjects = rulesCorrelated.filter(hit => hit.elastic_rule === true);

    // calculate the rule usage
    const rulesUsage = rulesCorrelated.reduce((usage, rule) => (0, _update_usage.updateRuleUsage)(rule, usage), (0, _get_initial_usage.getInitialRulesUsage)());
    return {
      detection_rule_detail: elasticRuleObjects,
      detection_rule_usage: rulesUsage,
      detection_rule_status: eventLogMetricsTypeStatus
    };
  } catch (e) {
    // ignore failure, usage will be zeroed. We use debug mode to not unnecessarily worry users as this will not effect them.
    logger.debug(`Encountered unexpected condition in telemetry of message: ${e.message}, object: ${e}. Telemetry for "detection rules" being skipped.`);
    return {
      detection_rule_detail: [],
      detection_rule_usage: (0, _get_initial_usage.getInitialRulesUsage)(),
      detection_rule_status: (0, _get_initial_usage.getInitialEventLogUsage)()
    };
  }
};
exports.getRuleMetrics = getRuleMetrics;