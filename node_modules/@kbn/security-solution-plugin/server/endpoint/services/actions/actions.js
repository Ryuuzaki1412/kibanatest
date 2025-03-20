"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuditLogResponse = void 0;
var _utils = require("../../utils");
var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAuditLogResponse = async ({
  elasticAgentId,
  page,
  pageSize,
  startDate,
  endDate,
  context,
  logger
}) => {
  const size = Math.floor(pageSize / 2);
  const from = page <= 1 ? 0 : page * size - size + 1;
  const data = await getActivityLog({
    context,
    from,
    size,
    startDate,
    endDate,
    elasticAgentId,
    logger
  });
  return {
    page,
    pageSize,
    startDate,
    endDate,
    data
  };
};
exports.getAuditLogResponse = getAuditLogResponse;
const getActivityLog = async ({
  context,
  size,
  from,
  startDate,
  endDate,
  elasticAgentId,
  logger
}) => {
  var _actionsResult, _responsesResult, _responsesResult$body, _responsesResult$body2, _actionsResult2, _actionsResult2$body, _actionsResult2$body$;
  let actionsResult;
  let responsesResult;
  try {
    // fetch actions with matching agent_id
    const {
      actionIds,
      actionRequests
    } = await (0, _utils.getActionRequestsResult)({
      context,
      logger,
      elasticAgentId,
      startDate,
      endDate,
      size,
      from
    });
    actionsResult = actionRequests;

    // fetch responses with matching unique set of `action_id`s
    responsesResult = await (0, _utils.getActionResponsesResult)({
      actionIds: [...new Set(actionIds)],
      // de-dupe `action_id`s
      context,
      logger,
      elasticAgentId,
      startDate,
      endDate
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
  if (((_actionsResult = actionsResult) === null || _actionsResult === void 0 ? void 0 : _actionsResult.statusCode) !== 200) {
    logger.error(`Error fetching actions log for agent_id ${elasticAgentId}`);
    throw new Error(`Error fetching actions log for agent_id ${elasticAgentId}`);
  }

  // label record as `action`, `fleetAction`
  const responses = (0, _utils2.categorizeResponseResults)({
    results: (_responsesResult = responsesResult) === null || _responsesResult === void 0 ? void 0 : (_responsesResult$body = _responsesResult.body) === null || _responsesResult$body === void 0 ? void 0 : (_responsesResult$body2 = _responsesResult$body.hits) === null || _responsesResult$body2 === void 0 ? void 0 : _responsesResult$body2.hits
  });

  // label record as `response`, `fleetResponse`
  const actions = (0, _utils2.categorizeActionResults)({
    results: (_actionsResult2 = actionsResult) === null || _actionsResult2 === void 0 ? void 0 : (_actionsResult2$body = _actionsResult2.body) === null || _actionsResult2$body === void 0 ? void 0 : (_actionsResult2$body$ = _actionsResult2$body.hits) === null || _actionsResult2$body$ === void 0 ? void 0 : _actionsResult2$body$.hits
  });

  // filter out the duplicate endpoint actions that also have fleetActions
  // include endpoint actions that have no fleet actions
  const uniqueLogData = (0, _utils2.getUniqueLogData)([...responses, ...actions]);

  // sort by @timestamp in desc order, newest first
  const sortedData = (0, _utils.getTimeSortedData)(uniqueLogData);
  return sortedData;
};