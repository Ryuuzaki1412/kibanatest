"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryMetrics = exports.IN_MEMORY_METRICS = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let IN_MEMORY_METRICS;
exports.IN_MEMORY_METRICS = IN_MEMORY_METRICS;
(function (IN_MEMORY_METRICS) {
  IN_MEMORY_METRICS["ACTION_EXECUTIONS"] = "actionExecutions";
  IN_MEMORY_METRICS["ACTION_FAILURES"] = "actionFailures";
  IN_MEMORY_METRICS["ACTION_TIMEOUTS"] = "actionTimeouts";
})(IN_MEMORY_METRICS || (exports.IN_MEMORY_METRICS = IN_MEMORY_METRICS = {}));
class InMemoryMetrics {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "inMemoryMetrics", {
      [IN_MEMORY_METRICS.ACTION_EXECUTIONS]: 0,
      [IN_MEMORY_METRICS.ACTION_FAILURES]: 0,
      [IN_MEMORY_METRICS.ACTION_TIMEOUTS]: 0
    });
    this.logger = logger;
  }
  increment(metric) {
    if (this.inMemoryMetrics[metric] === null) {
      this.logger.info(`Metric ${metric} is null because the counter ran over the max safe integer value, skipping increment.`);
      return;
    }
    if (this.inMemoryMetrics[metric] >= Number.MAX_SAFE_INTEGER) {
      this.inMemoryMetrics[metric] = null;
      this.logger.info(`Metric ${metric} has reached the max safe integer value and will no longer be used, skipping increment.`);
    } else {
      this.inMemoryMetrics[metric]++;
    }
  }
  getInMemoryMetric(metric) {
    return this.inMemoryMetrics[metric];
  }
  getAllInMemoryMetrics() {
    return this.inMemoryMetrics;
  }
}
exports.InMemoryMetrics = InMemoryMetrics;