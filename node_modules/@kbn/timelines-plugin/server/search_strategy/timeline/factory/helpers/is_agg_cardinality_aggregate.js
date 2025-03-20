"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAggCardinalityAggregate = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// type guard for checking if the Aggregation for a given field is a Cardinality
// Agregate with valid value
const isAggCardinalityAggregate = (aggregation, field) => {
  var _aggregation$field;
  return (aggregation === null || aggregation === void 0 ? void 0 : (_aggregation$field = aggregation[field]) === null || _aggregation$field === void 0 ? void 0 : _aggregation$field.value) !== undefined;
};
exports.isAggCardinalityAggregate = isAggCardinalityAggregate;