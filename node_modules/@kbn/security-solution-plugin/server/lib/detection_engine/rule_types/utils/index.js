"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createResultObject: true
};
exports.createResultObject = void 0;
var _get_list_client = require("./get_list_client");
Object.keys(_get_list_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _get_list_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_list_client[key];
    }
  });
});
var _validate_mutated_params = require("./validate_mutated_params");
Object.keys(_validate_mutated_params).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _validate_mutated_params[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validate_mutated_params[key];
    }
  });
});
var _build_timestamp_runtime_mapping = require("./build_timestamp_runtime_mapping");
Object.keys(_build_timestamp_runtime_mapping).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _build_timestamp_runtime_mapping[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _build_timestamp_runtime_mapping[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createResultObject = state => {
  const result = {
    enrichmentTimes: [],
    bulkCreateTimes: [],
    createdSignalsCount: 0,
    createdSignals: [],
    errors: [],
    lastLookbackDate: undefined,
    searchAfterTimes: [],
    state,
    success: true,
    warning: false,
    warningMessages: []
  };
  return result;
};
exports.createResultObject = createResultObject;