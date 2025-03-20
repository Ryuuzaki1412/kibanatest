"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchExistingAlerts = void 0;
var _lodash = require("lodash");
var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CHUNK_SIZE = 10000;
const fetchAlertsForStates = async (ruleDataClient, states, commonRuleFields) => {
  const request = {
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              [_technical_rule_data_field_names.ALERT_RULE_UUID]: commonRuleFields[_technical_rule_data_field_names.ALERT_RULE_UUID]
            }
          }, {
            terms: {
              [_technical_rule_data_field_names.ALERT_UUID]: states.map(state => state.alertUuid)
            }
          }]
        }
      },
      size: states.length,
      collapse: {
        field: _technical_rule_data_field_names.ALERT_UUID
      },
      sort: {
        [_technical_rule_data_field_names.TIMESTAMP]: 'desc'
      }
    },
    allow_no_indices: true
  };
  const {
    hits
  } = await ruleDataClient.getReader().search(request);
  return hits.hits;
};
const fetchExistingAlerts = async (ruleDataClient, trackedAlertStates, commonRuleFields) => {
  const results = await Promise.all((0, _lodash.chunk)(trackedAlertStates, CHUNK_SIZE).map(states => fetchAlertsForStates(ruleDataClient, states, commonRuleFields)));
  return results.flat();
};
exports.fetchExistingAlerts = fetchExistingAlerts;