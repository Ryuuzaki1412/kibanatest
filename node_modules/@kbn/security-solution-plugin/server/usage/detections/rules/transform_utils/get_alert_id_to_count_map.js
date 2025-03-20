"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertIdToCountMap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAlertIdToCountMap = alerts => {
  const alertsCache = new Map();
  alerts.map(bucket => alertsCache.set(bucket.key.detectionAlerts, bucket.doc_count));
  return alertsCache;
};
exports.getAlertIdToCountMap = getAlertIdToCountMap;