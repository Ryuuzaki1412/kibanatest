"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreferredServiceAnomalyTimeseries = getPreferredServiceAnomalyTimeseries;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getPreferredServiceAnomalyTimeseries({
  preferredEnvironment,
  detectorType,
  allAnomalyTimeseries,
  fallbackToTransactions
}) {
  const seriesForType = allAnomalyTimeseries.filter(serie => serie.type === detectorType);
  return seriesForType.find(serie => serie.environment === preferredEnvironment && (fallbackToTransactions ? serie.version <= 2 : serie.version >= 3));
}