"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTechnicalFields = void 0;
var _Either = require("fp-ts/lib/Either");
var _PathReporter = require("io-ts/lib/PathReporter");
var _lodash = require("lodash");
var _technical_rule_field_map = require("./assets/field_maps/technical_rule_field_map");
var _field_map = require("./field_map");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const technicalFieldRuntimeType = (0, _field_map.runtimeTypeFromFieldMap)(_technical_rule_field_map.technicalRuleFieldMap);
const parseTechnicalFields = (input, partial = false) => {
  const decodePartial = alert => {
    const limitedFields = (0, _lodash.pick)(_technical_rule_field_map.technicalRuleFieldMap, Object.keys(alert));
    const partialTechnicalFieldRuntimeType = (0, _field_map.runtimeTypeFromFieldMap)(limitedFields);
    return partialTechnicalFieldRuntimeType.decode(alert);
  };
  const validate = partial ? decodePartial(input) : technicalFieldRuntimeType.decode(input);
  if ((0, _Either.isLeft)(validate)) {
    throw new Error(_PathReporter.PathReporter.report(validate).join('\n'));
  }
  return technicalFieldRuntimeType.encode(validate.right);
};
exports.parseTechnicalFields = parseTechnicalFields;