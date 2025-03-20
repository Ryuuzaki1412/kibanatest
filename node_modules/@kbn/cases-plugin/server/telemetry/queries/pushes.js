"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPushedTelemetryData = void 0;
var _constants = require("../../../common/constants");
var _utils = require("../../client/utils");
var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPushedTelemetryData = async ({
  savedObjectsClient
}) => {
  var _res$aggregations$ref, _res$aggregations, _res$aggregations$ref2, _res$aggregations$ref3, _res$aggregations$ref4;
  const pushFilter = (0, _utils.buildFilter)({
    filters: ['pushed'],
    field: 'type',
    operator: 'or',
    type: _constants.CASE_USER_ACTION_SAVED_OBJECT
  });
  const res = await savedObjectsClient.find({
    page: 0,
    perPage: 0,
    filter: pushFilter,
    type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
    aggs: {
      ...(0, _utils2.getMaxBucketOnCaseAggregationQuery)(_constants.CASE_USER_ACTION_SAVED_OBJECT)
    }
  });
  const maxOnACase = (_res$aggregations$ref = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : (_res$aggregations$ref2 = _res$aggregations.references) === null || _res$aggregations$ref2 === void 0 ? void 0 : (_res$aggregations$ref3 = _res$aggregations$ref2.cases) === null || _res$aggregations$ref3 === void 0 ? void 0 : (_res$aggregations$ref4 = _res$aggregations$ref3.max) === null || _res$aggregations$ref4 === void 0 ? void 0 : _res$aggregations$ref4.value) !== null && _res$aggregations$ref !== void 0 ? _res$aggregations$ref : 0;
  return {
    all: {
      total: res.total,
      maxOnACase
    }
  };
};
exports.getPushedTelemetryData = getPushedTelemetryData;