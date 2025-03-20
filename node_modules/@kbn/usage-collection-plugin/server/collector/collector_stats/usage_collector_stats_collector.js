"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usageCollectorsStatsCollector = void 0;
var _lodash = require("lodash");
var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const usageCollectorsStatsCollector = (usageCollection, {
  nonReadyCollectorTypes,
  timedOutCollectorsTypes,
  isReadyExecutionDurationByType,
  fetchExecutionDurationByType
}) => {
  return usageCollection.makeUsageCollector({
    type: 'usage_collector_stats',
    isReady: () => true,
    schema: _schema.collectorsStatsSchema,
    fetch: () => {
      const totalIsReadyDuration = (0, _lodash.sumBy)(isReadyExecutionDurationByType, 'duration');
      const totalFetchDuration = (0, _lodash.sumBy)(fetchExecutionDurationByType, 'duration');
      const succeededCollectorTypes = fetchExecutionDurationByType.filter(({
        status
      }) => status === 'success').map(({
        type
      }) => type);
      const failedCollectorTypes = fetchExecutionDurationByType.filter(({
        status
      }) => status === 'failed').map(({
        type
      }) => type);
      const collectorsStats = {
        // isReady and fetch stats
        not_ready: {
          count: nonReadyCollectorTypes.length,
          names: nonReadyCollectorTypes
        },
        not_ready_timeout: {
          count: timedOutCollectorsTypes.length,
          names: timedOutCollectorsTypes
        },
        succeeded: {
          count: succeededCollectorTypes.length,
          names: succeededCollectorTypes
        },
        failed: {
          count: failedCollectorTypes.length,
          names: failedCollectorTypes
        },
        // total durations
        total_is_ready_duration: totalIsReadyDuration,
        total_fetch_duration: totalFetchDuration,
        total_duration: totalIsReadyDuration + totalFetchDuration,
        // durations breakdown
        is_ready_duration_breakdown: isReadyExecutionDurationByType.map(({
          type: name,
          duration
        }) => ({
          name,
          duration
        })),
        fetch_duration_breakdown: fetchExecutionDurationByType.map(({
          type: name,
          duration
        }) => ({
          name,
          duration
        }))
      };
      return collectorsStats;
    }
  });
};
exports.usageCollectorsStatsCollector = usageCollectorsStatsCollector;