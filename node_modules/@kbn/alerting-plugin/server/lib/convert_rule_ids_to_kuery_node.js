"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertRuleIdsToKueryNode = void 0;
var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This utility converts array of rule ids into qNode filter
 */

const convertRuleIdsToKueryNode = ids => _esQuery.nodeBuilder.or(ids.map(ruleId => _esQuery.nodeBuilder.is('alert.id', `alert:${ruleId}`)));
exports.convertRuleIdsToKueryNode = convertRuleIdsToKueryNode;