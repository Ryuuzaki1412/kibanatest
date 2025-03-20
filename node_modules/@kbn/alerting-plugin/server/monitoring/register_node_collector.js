"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerNodeCollector = registerNodeCollector;
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerNodeCollector({
  monitoringCollection,
  inMemoryMetrics
}) {
  monitoringCollection.registerMetric({
    type: 'node_rules',
    schema: {
      failures: {
        type: 'long'
      },
      executions: {
        type: 'long'
      },
      timeouts: {
        type: 'long'
      }
    },
    fetch: async () => {
      return {
        failures: inMemoryMetrics.getInMemoryMetric(_.IN_MEMORY_METRICS.RULE_FAILURES),
        executions: inMemoryMetrics.getInMemoryMetric(_.IN_MEMORY_METRICS.RULE_EXECUTIONS),
        timeouts: inMemoryMetrics.getInMemoryMetric(_.IN_MEMORY_METRICS.RULE_TIMEOUTS)
      };
    }
  });
}