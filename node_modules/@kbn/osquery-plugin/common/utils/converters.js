"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertShardsToObject = exports.convertShardsToArray = exports.convertECSMappingToObject = exports.convertECSMappingToArray = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const convertECSMappingToObject = ecsMapping => (0, _lodash.reduce)(ecsMapping, (acc, value) => {
  var _value$result, _value$result2;
  if (!(0, _lodash.isEmpty)(value === null || value === void 0 ? void 0 : value.key) && !(0, _lodash.isEmpty)((_value$result = value.result) === null || _value$result === void 0 ? void 0 : _value$result.type) && !(0, _lodash.isEmpty)((_value$result2 = value.result) === null || _value$result2 === void 0 ? void 0 : _value$result2.value)) {
    acc[value.key] = {
      [value.result.type]: value.result.value
    };
  }
  return acc;
}, {});
exports.convertECSMappingToObject = convertECSMappingToObject;
const convertECSMappingToArray = ecsMapping => (0, _lodash.reduce)(ecsMapping, (acc, value, key) => {
  if (value) {
    acc.push({
      key,
      result: {
        type: Object.keys(value)[0],
        value: Object.values(value)[0]
      }
    });
  }
  return acc;
}, []);
exports.convertECSMappingToArray = convertECSMappingToArray;
const convertShardsToObject = shards => (0, _lodash.reduce)(shards, (acc, value) => {
  if (!(0, _lodash.isEmpty)(value === null || value === void 0 ? void 0 : value.policy)) {
    acc[value.policy.key] = value.percentage;
  }
  return acc;
}, {});
exports.convertShardsToObject = convertShardsToObject;
const convertShardsToArray = (shards, policiesById) => (0, _lodash.reduce)(shards, (acc, value, key) => {
  if (value != null) {
    var _policiesById$key$nam, _policiesById$key;
    acc.push({
      policy: {
        key,
        label: (_policiesById$key$nam = policiesById === null || policiesById === void 0 ? void 0 : (_policiesById$key = policiesById[key]) === null || _policiesById$key === void 0 ? void 0 : _policiesById$key.name) !== null && _policiesById$key$nam !== void 0 ? _policiesById$key$nam : ''
      },
      percentage: value
    });
  }
  return acc;
}, []);
exports.convertShardsToArray = convertShardsToArray;