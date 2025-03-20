"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getView = void 0;
var _search_strategy = require("../../../../common/search_strategy");
var _risk_score_modules = require("../../../../common/utils/risk_score_modules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRiskyHostPrebuiltDevToolsContent = ({
  spaceId = 'default'
}) => {
  const riskScoreEntity = _search_strategy.RiskScoreEntity.host;
  const stringifyScript = true;
  return {
    spaceId,
    createLevelScriptOptions: (0, _risk_score_modules.getRiskHostCreateLevelScriptOptions)(spaceId, stringifyScript),
    createInitScriptOptions: (0, _risk_score_modules.getRiskHostCreateInitScriptOptions)(spaceId, stringifyScript),
    createMapScriptOptions: (0, _risk_score_modules.getRiskHostCreateMapScriptOptions)(spaceId, stringifyScript),
    createReduceScriptOptions: (0, _risk_score_modules.getRiskHostCreateReduceScriptOptions)(spaceId, stringifyScript),
    createIngestPipelineOptions: (0, _risk_score_modules.getRiskScoreIngestPipelineOptions)(riskScoreEntity, spaceId, stringifyScript),
    createRiskScoreIndicesOptions: (0, _risk_score_modules.getCreateRiskScoreIndicesOptions)({
      spaceId,
      riskScoreEntity,
      stringifyScript
    }),
    createRiskScoreLatestIndicesOptions: (0, _risk_score_modules.getCreateRiskScoreLatestIndicesOptions)({
      spaceId,
      riskScoreEntity,
      stringifyScript
    }),
    pivotTransformId: (0, _risk_score_modules.getRiskScorePivotTransformId)(riskScoreEntity, spaceId),
    pivotTransformOptions: (0, _risk_score_modules.getCreateMLHostPivotTransformOptions)({
      spaceId,
      stringifyScript
    }),
    latestTransformId: (0, _risk_score_modules.getRiskScoreLatestTransformId)(riskScoreEntity, spaceId),
    latestTransformOptions: (0, _risk_score_modules.getCreateLatestTransformOptions)({
      spaceId,
      riskScoreEntity,
      stringifyScript
    })
  };
};
const getRiskyUserPrebuiltDevToolsContent = ({
  spaceId = 'default'
}) => {
  const riskScoreEntity = _search_strategy.RiskScoreEntity.user;
  const stringifyScript = true;
  return {
    spaceId,
    createLevelScriptOptions: (0, _risk_score_modules.getRiskUserCreateLevelScriptOptions)(spaceId, stringifyScript),
    createMapScriptOptions: (0, _risk_score_modules.getRiskUserCreateMapScriptOptions)(spaceId, stringifyScript),
    createReduceScriptOptions: (0, _risk_score_modules.getRiskUserCreateReduceScriptOptions)(spaceId, stringifyScript),
    createIngestPipelineOptions: (0, _risk_score_modules.getRiskScoreIngestPipelineOptions)(riskScoreEntity, spaceId, stringifyScript),
    createRiskScoreIndicesOptions: (0, _risk_score_modules.getCreateRiskScoreIndicesOptions)({
      spaceId,
      riskScoreEntity,
      stringifyScript
    }),
    createRiskScoreLatestIndicesOptions: (0, _risk_score_modules.getCreateRiskScoreLatestIndicesOptions)({
      spaceId,
      riskScoreEntity,
      stringifyScript
    }),
    pivotTransformId: (0, _risk_score_modules.getRiskScorePivotTransformId)(riskScoreEntity, spaceId),
    pivotTransformOptions: (0, _risk_score_modules.getCreateMLUserPivotTransformOptions)({
      spaceId,
      stringifyScript
    }),
    latestTransformId: (0, _risk_score_modules.getRiskScoreLatestTransformId)(riskScoreEntity, spaceId),
    latestTransformOptions: (0, _risk_score_modules.getCreateLatestTransformOptions)({
      spaceId,
      riskScoreEntity,
      stringifyScript
    })
  };
};
const getView = ({
  spaceId = 'default',
  riskScoreEntity
}) => {
  if (riskScoreEntity === _search_strategy.RiskScoreEntity.user) {
    return getRiskyUserPrebuiltDevToolsContent({
      spaceId
    });
  }
  return getRiskyHostPrebuiltDevToolsContent({
    spaceId
  });
};
exports.getView = getView;