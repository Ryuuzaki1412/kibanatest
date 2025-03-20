"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFieldAndSetTuples = void 0;
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _create_set_to_filter_against = require("./create_set_to_filter_against");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createFieldAndSetTuples = async ({
  events,
  exceptionItem,
  listClient,
  ruleExecutionLogger
}) => {
  const typedEntries = exceptionItem.entries.filter(entry => _securitysolutionIoTsListTypes.entriesList.is(entry));
  const fieldAndSetTuples = await Promise.all(typedEntries.map(async entry => {
    const {
      list,
      field,
      operator
    } = entry;
    const {
      id,
      type
    } = list;
    const matchedSet = await (0, _create_set_to_filter_against.createSetToFilterAgainst)({
      events,
      field,
      listId: id,
      listType: type,
      listClient,
      ruleExecutionLogger
    });
    return {
      field,
      operator,
      matchedSet
    };
  }));
  return fieldAndSetTuples;
};
exports.createFieldAndSetTuples = createFieldAndSetTuples;