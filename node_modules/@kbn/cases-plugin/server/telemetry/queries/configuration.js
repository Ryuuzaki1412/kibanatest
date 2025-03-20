"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfigurationTelemetryData = void 0;
var _constants = require("../../../common/constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getConfigurationTelemetryData = async ({
  savedObjectsClient
}) => {
  var _res$aggregations$clo, _res$aggregations, _res$aggregations$clo2;
  const res = await savedObjectsClient.find({
    page: 0,
    perPage: 0,
    type: _constants.CASE_CONFIGURE_SAVED_OBJECT,
    aggs: {
      closureType: {
        terms: {
          field: `${_constants.CASE_CONFIGURE_SAVED_OBJECT}.attributes.closure_type`
        }
      }
    }
  });
  const closureBuckets = (_res$aggregations$clo = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : (_res$aggregations$clo2 = _res$aggregations.closureType) === null || _res$aggregations$clo2 === void 0 ? void 0 : _res$aggregations$clo2.buckets) !== null && _res$aggregations$clo !== void 0 ? _res$aggregations$clo : [];
  return {
    all: {
      closure: {
        manually: (0, _utils.findValueInBuckets)(closureBuckets, 'close-by-user'),
        automatic: (0, _utils.findValueInBuckets)(closureBuckets, 'close-by-pushing')
      }
    }
  };
};
exports.getConfigurationTelemetryData = getConfigurationTelemetryData;