"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateBuildingBlockIds = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _crypto = require("crypto");
var _field_names = require("../../../../../../common/field_maps/field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Generates unique doc ids for each building block signal within a sequence. The id of each building block
 * depends on the parents of every building block, so that a signal which appears in multiple different sequences
 * (e.g. if multiple rules build sequences that share a common event/signal) will get a unique id per sequence.
 * @param buildingBlocks The full list of building blocks in the sequence.
 */
const generateBuildingBlockIds = buildingBlocks => {
  const baseHashString = buildingBlocks.reduce((baseString, block) => baseString.concat(block[_field_names.ALERT_ANCESTORS].reduce((acc, ancestor) => acc.concat(ancestor.id, ancestor.index), '')).concat(block[_ruleDataUtils.ALERT_RULE_UUID]), '');
  return buildingBlocks.map((block, idx) => (0, _crypto.createHash)('sha256').update(baseHashString).update(String(idx)).digest('hex'));
};
exports.generateBuildingBlockIds = generateBuildingBlockIds;