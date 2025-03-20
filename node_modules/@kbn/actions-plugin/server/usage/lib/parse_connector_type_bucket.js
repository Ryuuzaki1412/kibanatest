"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseActionRunOutcomeByConnectorTypesBucket = parseActionRunOutcomeByConnectorTypesBucket;
var _actions_telemetry = require("../actions_telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function parseActionRunOutcomeByConnectorTypesBucket(connectorTypeBuckets = []) {
  const connectorTypes = connectorTypeBuckets;
  return connectorTypes.reduce((acc, connectorType) => {
    var _connectorType$outcom, _connectorType$outcom2, _connectorType$outcom3;
    const outcomes = (_connectorType$outcom = (_connectorType$outcom2 = connectorType.outcome) === null || _connectorType$outcom2 === void 0 ? void 0 : (_connectorType$outcom3 = _connectorType$outcom2.count) === null || _connectorType$outcom3 === void 0 ? void 0 : _connectorType$outcom3.buckets) !== null && _connectorType$outcom !== void 0 ? _connectorType$outcom : [];
    return {
      ...acc,
      [(0, _actions_telemetry.replaceFirstAndLastDotSymbols)(connectorType.key)]: outcomes.reduce((accBucket, bucket) => {
        return {
          ...accBucket,
          [(0, _actions_telemetry.replaceFirstAndLastDotSymbols)(bucket.key)]: bucket.doc_count || 0
        };
      }, {})
    };
  }, {});
}