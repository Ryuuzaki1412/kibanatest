"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterHostedPolicies = filterHostedPolicies;
var _errors = require("../../errors");
var _hosted_agent = require("./hosted_agent");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function filterHostedPolicies(soClient, givenAgents, outgoingErrors, errorMessage) {
  const hostedPolicies = await (0, _hosted_agent.getHostedPolicies)(soClient, givenAgents);
  return givenAgents.reduce((agents, agent, index) => {
    if ((0, _hosted_agent.isHostedAgent)(hostedPolicies, agent)) {
      const id = givenAgents[index].id;
      outgoingErrors[id] = new _errors.HostedAgentPolicyRestrictionRelatedError(errorMessage);
    } else {
      agents.push(agent);
    }
    return agents;
  }, []);
}