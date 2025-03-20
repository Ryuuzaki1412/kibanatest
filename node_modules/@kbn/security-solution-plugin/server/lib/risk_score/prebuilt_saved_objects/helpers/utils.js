"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRiskScoreTagName = exports.USER_RISK_SCORE = exports.RISK_SCORE_TAG_DESCRIPTION = exports.RISK_SCORE_REPLACE_ID_MAPPINGS = exports.HOST_RISK_SCORE = void 0;
var _search_strategy = require("../../../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const HOST_RISK_SCORE = 'Host Risk Score';
exports.HOST_RISK_SCORE = HOST_RISK_SCORE;
const USER_RISK_SCORE = 'User Risk Score';
exports.USER_RISK_SCORE = USER_RISK_SCORE;
const RISK_SCORE_TAG_DESCRIPTION = 'Security Solution Risk Score auto-generated tag';
exports.RISK_SCORE_TAG_DESCRIPTION = RISK_SCORE_TAG_DESCRIPTION;
const getRiskScore = riskScoreEntity => riskScoreEntity === _search_strategy.RiskScoreEntity.user ? USER_RISK_SCORE : HOST_RISK_SCORE;
const getRiskScoreTagName = (riskScoreEntity, spaceId = 'default') => `${getRiskScore(riskScoreEntity)} - ${spaceId}`;

/**
 * These mappings are for keeping track of the saved objects installed before 8.5 release,
 * so we can delete them when upgrading.
 */
exports.getRiskScoreTagName = getRiskScoreTagName;
const RISK_SCORE_REPLACE_ID_MAPPINGS = {
  hostRiskScoreDashboards: {
    '<REPLACE-WITH-ID1>': 'd3f72670-d3a0-11eb-bd37-7bb50422e346',
    '<REPLACE-WITH-ID2>': '42371d00-cf7a-11eb-9a96-05d89f94ad96',
    '<REPLACE-WITH-ID3>': 'a62d3ed0-cf92-11eb-a0ff-1763d16cbda7',
    '<REPLACE-WITH-ID4>': 'b2dbc9b0-cf94-11eb-bd37-7bb50422e346',
    '<REPLACE-WITH-ID5>': '1d00ebe0-f3b2-11eb-beb2-b91666445a94',
    '<REPLACE-WITH-ID6>': '6f05c8c0-cf77-11eb-9a96-05d89f94ad96',
    '<REPLACE-WITH-ID7>': 'dc289c10-d4ff-11eb-a0ff-1763d16cbda7',
    '<REPLACE-WITH-ID8>': '27b483b0-d500-11eb-a0ff-1763d16cbda7',
    '<REPLACE-WITH-ID9>': 'ml-host-risk-score-latest-<REPLACE-WITH-SPACE>-index-pattern',
    '<REPLACE-WITH-ID10>': 'ml-host-risk-score-<REPLACE-WITH-SPACE>-index-pattern',
    '<REPLACE-WITH-ID11>': 'alerts-<REPLACE-WITH-SPACE>-index-pattern'
  },
  userRiskScoreDashboards: {
    '<REPLACE-WITH-ID1>': '54dadd60-1a57-11ed-bb53-ad8c26f4d942',
    '<REPLACE-WITH-ID2>': '60454070-9a5d-11ec-9633-5f782d122340',
    '<REPLACE-WITH-ID3>': 'a62d3ed0-cf92-11eb-a0ff-1763d16cbda7',
    '<REPLACE-WITH-ID4>': '42371d00-cf7a-11eb-9a96-05d89f94ad96',
    '<REPLACE-WITH-ID5>': '183d32f0-9a5e-11ec-90d3-1109ed409ab5',
    '<REPLACE-WITH-ID6>': '93fc0f00-1a57-11ed-bb53-ad8c26f4d942',
    '<REPLACE-WITH-ID7>': '8ac3ad30-1a57-11ed-bb53-ad8c26f4d942',
    '<REPLACE-WITH-ID8>': '1355b030-ca2b-11ec-962f-a3a018b7d10f',
    '<REPLACE-WITH-ID9>': 'ml-user-risk-score-latest-<REPLACE-WITH-SPACE>-index-pattern',
    '<REPLACE-WITH-ID10>': 'ml-user-risk-score-<REPLACE-WITH-SPACE>-index-pattern',
    '<REPLACE-WITH-ID11>': 'alerts-<REPLACE-WITH-SPACE>-index-pattern'
  }
};
exports.RISK_SCORE_REPLACE_ID_MAPPINGS = RISK_SCORE_REPLACE_ID_MAPPINGS;