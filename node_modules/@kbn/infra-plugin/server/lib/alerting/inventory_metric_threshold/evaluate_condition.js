"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateCondition = void 0;
var _lodash = require("lodash");
var _calculate_from_based_on_metric = require("./lib/calculate_from_based_on_metric");
var _get_data = require("./lib/get_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const evaluateCondition = async ({
  condition,
  nodeType,
  source,
  logQueryFields,
  esClient,
  compositeSize,
  filterQuery,
  lookbackSize,
  executionTimestamp,
  logger
}) => {
  const {
    metric,
    customMetric
  } = condition;
  const timerange = {
    to: executionTimestamp.valueOf(),
    from: (0, _calculate_from_based_on_metric.calculateFromBasedOnMetric)(executionTimestamp, condition, nodeType, metric, customMetric),
    interval: `${condition.timeSize}${condition.timeUnit}`,
    forceInterval: true
  };
  if (lookbackSize) {
    timerange.lookbackSize = lookbackSize;
  }
  const currentValues = await (0, _get_data.getData)(esClient, nodeType, metric, timerange, source, logQueryFields, compositeSize, condition, logger, filterQuery, customMetric);
  const result = (0, _lodash.mapValues)(currentValues, value => {
    return {
      ...condition,
      shouldFire: value.trigger,
      shouldWarn: value.warn,
      isNoData: value === null,
      isError: value === undefined,
      currentValue: value.value,
      context: {
        cloud: value.cloud,
        host: value.host,
        container: value.container,
        orchestrator: value.orchestrator,
        labels: value.labels,
        tags: value.tags
      }
    };
  }); // Typescript doesn't seem to know what `throw` is doing

  return result;
};
exports.evaluateCondition = evaluateCondition;