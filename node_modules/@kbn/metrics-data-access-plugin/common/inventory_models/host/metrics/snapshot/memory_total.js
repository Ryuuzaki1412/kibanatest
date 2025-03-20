"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoryTotal = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const memoryTotal = {
  memory_total: {
    avg: {
      field: 'system.memory.total'
    }
  },
  memoryTotal: {
    bucket_script: {
      buckets_path: {
        memoryTotal: 'memory_total'
      },
      script: {
        source: 'params.memoryTotal',
        lang: 'painless'
      },
      gap_policy: 'skip'
    }
  }
};
exports.memoryTotal = memoryTotal;