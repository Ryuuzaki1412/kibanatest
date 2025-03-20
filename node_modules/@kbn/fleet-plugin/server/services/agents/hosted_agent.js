"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHostedPolicies = getHostedPolicies;
exports.isHostedAgent = isHostedAgent;
var _agent_policy = require("../agent_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getHostedPolicies(soClient, agents) {
  // get any policy ids from upgradable agents
  const policyIdsToGet = new Set(agents.filter(agent => agent.policy_id).map(agent => agent.policy_id));

  // get the agent policies for those ids
  const agentPolicies = await _agent_policy.agentPolicyService.getByIDs(soClient, Array.from(policyIdsToGet), {
    fields: ['is_managed'],
    ignoreMissing: true
  });
  const hostedPolicies = agentPolicies.reduce((acc, policy) => {
    acc[policy.id] = policy.is_managed;
    return acc;
  }, {});
  return hostedPolicies;
}
function isHostedAgent(hostedPolicies, agent) {
  return agent.policy_id && hostedPolicies[agent.policy_id];
}