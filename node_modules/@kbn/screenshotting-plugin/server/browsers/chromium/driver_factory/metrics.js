"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetrics = getMetrics;
var _os = require("os");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function normalizeMetrics({
  metrics
}) {
  return Object.fromEntries(metrics.map(({
    name,
    value
  }) => [name, value]));
}
function getCpuUsage(start, end) {
  return (end.ProcessTime - start.ProcessTime) / (end.Timestamp - start.Timestamp) / (0, _os.cpus)().length;
}
function toPercentage(value) {
  return Math.round((value + Number.EPSILON) * 10000) / 100;
}
function toMegabytes(value) {
  return Math.round((value / 1024 / 1024 + Number.EPSILON) * 100) / 100;
}
function getMetrics(start, end) {
  const startMetrics = normalizeMetrics(start);
  const endMetrics = normalizeMetrics(end);
  const cpu = getCpuUsage(startMetrics, endMetrics);
  const cpuInPercentage = toPercentage(cpu);
  const {
    JSHeapTotalSize: memory
  } = endMetrics;
  const memoryInMegabytes = toMegabytes(memory);
  return {
    cpu,
    cpuInPercentage,
    memory,
    memoryInMegabytes
  };
}