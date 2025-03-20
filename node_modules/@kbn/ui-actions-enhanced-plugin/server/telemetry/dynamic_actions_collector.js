"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamicActionsCollector = void 0;
var _get_metric_key = require("./get_metric_key");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const dynamicActionsCollector = (state, currentStats) => {
  const stats = {
    ...currentStats
  };
  const countMetricKey = (0, _get_metric_key.getMetricKey)('count');
  stats[countMetricKey] = state.events.length + (stats[countMetricKey] || 0);
  for (const event of state.events) {
    const factoryId = event.action.factoryId;
    const actionCountMetric = (0, _get_metric_key.getMetricKey)(`actions.${factoryId}.count`);
    stats[actionCountMetric] = 1 + (stats[actionCountMetric] || 0);
    for (const trigger of event.triggers) {
      const triggerCountMetric = (0, _get_metric_key.getMetricKey)(`triggers.${trigger}.count`);
      const actionXTriggerCountMetric = (0, _get_metric_key.getMetricKey)(`action_triggers.${factoryId}_${trigger}.count`);
      stats[triggerCountMetric] = 1 + (stats[triggerCountMetric] || 0);
      stats[actionXTriggerCountMetric] = 1 + (stats[actionXTriggerCountMetric] || 0);
    }
  }
  return stats;
};
exports.dynamicActionsCollector = dynamicActionsCollector;