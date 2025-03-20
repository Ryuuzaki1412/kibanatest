"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleTaskTimeout = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_EXECUTION_TIMEOUT = '5m';
const getRuleTaskTimeout = ({
  config,
  ruleTaskTimeout,
  ruleTypeId
}) => {
  var _config$run$ruleTypeO;
  const ruleTypeConfig = (_config$run$ruleTypeO = config.run.ruleTypeOverrides) === null || _config$run$ruleTypeO === void 0 ? void 0 : _config$run$ruleTypeO.find(ruleType => ruleTypeId === ruleType.id);

  // First, rule type specific timeout config (ruleTypeOverrides) is applied if it's set in kibana.yml
  // if not, then timeout for all the rule types is applied if it's set in kibana.yml
  // if not, ruleTaskTimeout is applied that is passed from the rule type registering plugin
  // if none of above is set, DEFAULT_EXECUTION_TIMEOUT is applied
  return (ruleTypeConfig === null || ruleTypeConfig === void 0 ? void 0 : ruleTypeConfig.timeout) || config.run.timeout || ruleTaskTimeout || DEFAULT_EXECUTION_TIMEOUT;
};
exports.getRuleTaskTimeout = getRuleTaskTimeout;