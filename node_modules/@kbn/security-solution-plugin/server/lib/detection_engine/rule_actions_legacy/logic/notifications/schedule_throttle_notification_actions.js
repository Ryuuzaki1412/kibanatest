"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleThrottledNotificationActions = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _utils = require("./utils");
var _constants = require("../../../../../../common/constants");
var _get_signals = require("./get_signals");
var _schedule_notification_actions = require("./schedule_notification_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Schedules a throttled notification action for executor rules.
 * NOTE: It's important that since this is throttled that you call this in _ALL_ cases including error conditions or results being empty or not a success.
 * If you do not call this within your rule executor then this will cause a "reset" and will stop "throttling" and the next call will cause an immediate action
 * to be sent through the system.
 * @param throttle The throttle which is the alerting saved object throttle
 * @param startedAt When the executor started at
 * @param id The id the alert which caused the notifications
 * @param kibanaSiemAppUrl The security_solution application url
 * @param outputIndex The alerting index we wrote the signals into
 * @param ruleId The rule_id of the alert which caused the notifications
 * @param esClient The elastic client to do queries
 * @param alertInstance The alert instance for notifications
 * @param notificationRuleParams The notification rule parameters
 */
const scheduleThrottledNotificationActions = async ({
  throttle,
  startedAt,
  id,
  kibanaSiemAppUrl,
  outputIndex,
  ruleId,
  esClient,
  alertInstance,
  notificationRuleParams,
  signals,
  logger
}) => {
  const fromInMs = (0, _securitysolutionIoTsUtils.parseScheduleDates)(`now-${throttle}`);
  const toInMs = (0, _securitysolutionIoTsUtils.parseScheduleDates)(startedAt.toISOString());
  if (fromInMs != null && toInMs != null) {
    var _results$hits$total$v, _results$hits$total;
    const resultsLink = (0, _utils.getNotificationResultsLink)({
      from: fromInMs.toISOString(),
      to: toInMs.toISOString(),
      id,
      kibanaSiemAppUrl
    });
    logger.debug([`The notification throttle resultsLink created is: ${resultsLink}.`, ' Notification throttle is querying the results using', ` "from:" ${fromInMs.valueOf()}`, ' "to":', ` ${toInMs.valueOf()}`, ' "size":', ` ${_constants.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE}`, ' "index":', ` ${outputIndex}`, ' "ruleId":', ` ${ruleId}`].join(''));
    const results = await (0, _get_signals.getSignals)({
      from: `${fromInMs.valueOf()}`,
      to: `${toInMs.valueOf()}`,
      size: _constants.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE,
      index: outputIndex,
      ruleId,
      esClient
    });

    // This will give us counts up to the max of 10k from tracking total hits.
    const signalsCountFromResults = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total$v = (_results$hits$total = results.hits.total) === null || _results$hits$total === void 0 ? void 0 : _results$hits$total.value) !== null && _results$hits$total$v !== void 0 ? _results$hits$total$v : 0;
    const resultsFlattened = results.hits.hits.map(hit => {
      return {
        _id: hit._id,
        _index: hit._index,
        ...hit._source
      };
    });
    const deconflicted = (0, _utils.deconflictSignalsAndResults)({
      logger,
      signals,
      querySignals: resultsFlattened
    });

    // Difference of how many deconflicted results we have to subtract from our signals count.
    const deconflictedDiff = resultsFlattened.length + signals.length - deconflicted.length;

    // Subtract any deconflicted differences from the total count.
    const signalsCount = signalsCountFromResults + signals.length - deconflictedDiff;
    logger.debug([`The notification throttle query result size before deconflicting duplicates is: ${resultsFlattened.length}.`, ` The notification throttle passed in signals size before deconflicting duplicates is: ${signals.length}.`, ` The deconflicted size and size of the signals sent into throttle notification is: ${deconflicted.length}.`, ` The signals count from results size is: ${signalsCountFromResults}.`, ` The final signals count being sent to the notification is: ${signalsCount}.`].join(''));
    if (deconflicted.length !== 0) {
      (0, _schedule_notification_actions.scheduleNotificationActions)({
        alertInstance,
        signalsCount,
        signals: deconflicted,
        resultsLink,
        ruleParams: notificationRuleParams
      });
    }
  } else {
    logger.error(['The notification throttle "from" and/or "to" range values could not be constructed as valid. Tried to construct the values of', ` "from": now-${throttle}`, ` "to": ${startedAt.toISOString()}.`, ' This will cause a reset of the notification throttle. Expect either missing alert notifications or alert notifications happening earlier than expected.', ` Check your rule with ruleId: "${ruleId}" for data integrity issues`].join(''));
  }
};
exports.scheduleThrottledNotificationActions = scheduleThrottledNotificationActions;