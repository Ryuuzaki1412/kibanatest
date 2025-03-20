"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileDownloadId = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Constructs a file ID for a given agent.
 * @param action
 * @param agentId
 */
const getFileDownloadId = (action, agentId) => {
  const {
    id: actionId,
    agents
  } = action;
  if (agentId && !agents.includes(agentId)) {
    throw new Error(`Action [${actionId}] was not sent to agent id [${agentId}]`);
  }
  return `${actionId}.${agentId !== null && agentId !== void 0 ? agentId : agents[0]}`;
};
exports.getFileDownloadId = getFileDownloadId;