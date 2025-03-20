"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcEstimatedCost = calcEstimatedCost;
exports.calcMemoryUsed = calcMemoryUsed;
exports.calcMemoryUsedRate = calcMemoryUsedRate;
exports.convertComputeUsageToGbSec = convertComputeUsageToGbSec;
var _is_finite_number = require("../../../../common/utils/is_finite_number");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function calcMemoryUsedRate({
  memoryFree,
  memoryTotal
}) {
  if (!(0, _is_finite_number.isFiniteNumber)(memoryFree) || !(0, _is_finite_number.isFiniteNumber)(memoryTotal)) {
    return undefined;
  }
  return (memoryTotal - memoryFree) / memoryTotal;
}
function calcMemoryUsed({
  memoryFree,
  memoryTotal
}) {
  if (!(0, _is_finite_number.isFiniteNumber)(memoryFree) || !(0, _is_finite_number.isFiniteNumber)(memoryTotal)) {
    return undefined;
  }
  return memoryTotal - memoryFree;
}
const GB = 1024 ** 3;
/**
 * To calculate the compute usage we need to multiply the "system.memory.total" by "faas.billed_duration".
 * But the result of this calculation is in Bytes-milliseconds, as the "system.memory.total" is stored in bytes and the "faas.billed_duration" is stored in milliseconds.
 * But to calculate the overall cost AWS uses GB-second, so we need to convert the result to this unit.
 */
function convertComputeUsageToGbSec({
  computeUsageBytesMs,
  countInvocations
}) {
  if (!(0, _is_finite_number.isFiniteNumber)(computeUsageBytesMs) || !(0, _is_finite_number.isFiniteNumber)(countInvocations)) {
    return undefined;
  }
  const computeUsageGbSec = computeUsageBytesMs / GB / 1000;
  return computeUsageGbSec * countInvocations;
}
function calcEstimatedCost({
  awsLambdaPriceFactor,
  architecture,
  transactionThroughput,
  awsLambdaRequestCostPerMillion,
  computeUsageGbSec
}) {
  try {
    if (!awsLambdaPriceFactor || !architecture || !(0, _is_finite_number.isFiniteNumber)(awsLambdaRequestCostPerMillion) || !(0, _is_finite_number.isFiniteNumber)(awsLambdaPriceFactor === null || awsLambdaPriceFactor === void 0 ? void 0 : awsLambdaPriceFactor[architecture]) || !(0, _is_finite_number.isFiniteNumber)(computeUsageGbSec)) {
      return undefined;
    }
    const priceFactor = awsLambdaPriceFactor === null || awsLambdaPriceFactor === void 0 ? void 0 : awsLambdaPriceFactor[architecture];
    const estimatedCost = computeUsageGbSec * priceFactor + transactionThroughput * (awsLambdaRequestCostPerMillion / 1000000);

    // Rounds up the decimals
    return Math.ceil(estimatedCost * 100) / 100;
  } catch (e) {
    return undefined;
  }
}