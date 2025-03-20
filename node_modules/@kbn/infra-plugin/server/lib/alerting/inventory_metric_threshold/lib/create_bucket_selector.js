"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBucketSelector = void 0;
var _create_condition_script = require("./create_condition_script");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EMPTY_SHOULD_WARN = {
  bucket_script: {
    buckets_path: {},
    script: '0'
  }
};
const createBucketSelector = (metric, condition, customMetric) => {
  const metricId = customMetric && customMetric.field ? customMetric.id : metric;
  const hasWarn = condition.warningThreshold != null && condition.warningComparator != null;
  const hasTrigger = condition.threshold != null && condition.comparator != null;
  const shouldWarn = hasWarn ? {
    bucket_script: {
      buckets_path: {
        value: metricId
      },
      script: (0, _create_condition_script.createConditionScript)(condition.warningThreshold, condition.warningComparator, metric)
    }
  } : EMPTY_SHOULD_WARN;
  const shouldTrigger = hasTrigger ? {
    bucket_script: {
      buckets_path: {
        value: metricId
      },
      script: (0, _create_condition_script.createConditionScript)(condition.threshold, condition.comparator, metric)
    }
  } : EMPTY_SHOULD_WARN;
  return {
    selectedBucket: {
      bucket_selector: {
        buckets_path: {
          shouldWarn: 'shouldWarn',
          shouldTrigger: 'shouldTrigger'
        },
        script: '(params.shouldWarn != null && params.shouldWarn > 0) || (params.shouldTrigger != null && params.shouldTrigger > 0)'
      }
    },
    shouldWarn,
    shouldTrigger
  };
};
exports.createBucketSelector = createBucketSelector;