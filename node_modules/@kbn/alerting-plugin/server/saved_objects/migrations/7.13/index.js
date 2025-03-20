"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations7130 = void 0;
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function convertNullToUndefined(attribute) {
  return attribute != null ? attribute : undefined;
}
function removeNullsFromSecurityRules(doc) {
  const {
    attributes: {
      params
    }
  } = doc;
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      params: {
        ...params,
        buildingBlockType: convertNullToUndefined(params.buildingBlockType),
        note: convertNullToUndefined(params.note),
        index: convertNullToUndefined(params.index),
        language: convertNullToUndefined(params.language),
        license: convertNullToUndefined(params.license),
        outputIndex: convertNullToUndefined(params.outputIndex),
        savedId: convertNullToUndefined(params.savedId),
        timelineId: convertNullToUndefined(params.timelineId),
        timelineTitle: convertNullToUndefined(params.timelineTitle),
        meta: convertNullToUndefined(params.meta),
        query: convertNullToUndefined(params.query),
        filters: convertNullToUndefined(params.filters),
        riskScoreMapping: params.riskScoreMapping != null ? params.riskScoreMapping : [],
        ruleNameOverride: convertNullToUndefined(params.ruleNameOverride),
        severityMapping: params.severityMapping != null ? params.severityMapping : [],
        threat: params.threat != null ? params.threat : [],
        threshold: params.threshold != null && typeof params.threshold === 'object' && !Array.isArray(params.threshold) ? {
          field: Array.isArray(params.threshold.field) ? params.threshold.field : params.threshold.field === '' || params.threshold.field == null ? [] : [params.threshold.field],
          value: params.threshold.value,
          cardinality: params.threshold.cardinality != null ? params.threshold.cardinality : []
        } : undefined,
        timestampOverride: convertNullToUndefined(params.timestampOverride),
        exceptionsList: params.exceptionsList != null ? params.exceptionsList : params.exceptions_list != null ? params.exceptions_list : params.lists != null ? params.lists : [],
        threatFilters: convertNullToUndefined(params.threatFilters),
        machineLearningJobId: params.machineLearningJobId == null ? undefined : Array.isArray(params.machineLearningJobId) ? params.machineLearningJobId : [params.machineLearningJobId]
      }
    }
  };
}
const getMigrations7130 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => (0, _utils.isSiemSignalsRuleType)(doc), (0, _utils.pipeMigrations)(removeNullsFromSecurityRules));
exports.getMigrations7130 = getMigrations7130;