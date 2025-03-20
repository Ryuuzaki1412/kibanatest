"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_CLUSTER_ACTIONS_METRICS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EMPTY_CLUSTER_ACTIONS_METRICS = {
  overdue: {
    count: 0,
    delay: {
      p50: 0,
      p99: 0
    }
  }
};
exports.EMPTY_CLUSTER_ACTIONS_METRICS = EMPTY_CLUSTER_ACTIONS_METRICS;