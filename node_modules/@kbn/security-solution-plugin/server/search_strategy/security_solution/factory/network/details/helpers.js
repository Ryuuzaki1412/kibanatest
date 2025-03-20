"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNetworkDetailsAgg = void 0;
var _fp = require("lodash/fp");
var _format_response_object_values = require("../../../../helpers/format_response_object_values");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNetworkDetailsAgg = (type, networkHit) => {
  const autonomousSystem = (0, _fp.getOr)({}, `${type}.as`, (0, _format_response_object_values.unflattenObject)((0, _fp.getOr)({}, 'as.results.hits.hits[0].fields', networkHit)));
  const geoFields = (0, _fp.getOr)({}, `${type}.geo`, (0, _format_response_object_values.unflattenObject)((0, _format_response_object_values.transformLocationFields)((0, _fp.getOr)({}, 'geo.results.hits.hits[0].fields', networkHit))));
  return {
    [type]: {
      autonomousSystem: {
        ...autonomousSystem
      },
      geo: {
        ...geoFields
      }
    }
  };
};
exports.getNetworkDetailsAgg = getNetworkDetailsAgg;