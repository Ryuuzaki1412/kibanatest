"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerK8sMemoryUsage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const containerK8sMemoryUsage = (timeField, indexPattern, interval) => ({
  id: 'containerK8sMemoryUsage',
  requires: ['kubernetes.container'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'memory',
    split_mode: 'everything',
    metrics: [{
      field: 'kubernetes.container.memory.usage.limit.pct',
      id: 'avg-memory',
      type: 'avg'
    }]
  }]
});
exports.containerK8sMemoryUsage = containerK8sMemoryUsage;