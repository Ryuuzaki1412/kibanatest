"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToSiblingPipelineColumns = void 0;
var _metrics = require("../metrics");
var _vis_schemas = require("../../../vis_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const convertToSiblingPipelineColumns = columnConverterArgs => {
  const {
    aggParams,
    label,
    aggId
  } = columnConverterArgs.agg;
  if (!aggParams) {
    return null;
  }
  if (!aggParams.customMetric) {
    return null;
  }
  const customMetricColumn = (0, _metrics.convertMetricToColumns)({
    agg: {
      ...(0, _vis_schemas.convertToSchemaConfig)(aggParams.customMetric),
      label,
      aggId
    },
    dataView: columnConverterArgs.dataView,
    aggs: columnConverterArgs.aggs,
    visType: columnConverterArgs.visType
  });
  if (!customMetricColumn) {
    return null;
  }
  return customMetricColumn[0];
};
exports.convertToSiblingPipelineColumns = convertToSiblingPipelineColumns;