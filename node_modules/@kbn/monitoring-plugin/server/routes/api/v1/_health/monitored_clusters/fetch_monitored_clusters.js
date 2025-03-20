"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMonitoredClusters = void 0;
var _lodash = require("lodash");
var _build_monitored_clusters = require("./build_monitored_clusters");
var _monitored_clusters_query = require("./monitored_clusters_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * executes multiple search requests to build a representation of the monitoring
 * documents. the queries aggregations are built with a similar hierarchy so
 * we can merge them to a single output
 */
const fetchMonitoredClusters = async ({
  timeout,
  monitoringIndex,
  entSearchIndex,
  timeRange,
  search,
  logger
}) => {
  const getMonitoredClusters = async (index, body) => {
    try {
      var _aggregations$cluster, _aggregations$cluster2;
      const {
        aggregations,
        timed_out: timedOut
      } = await search({
        index,
        body,
        size: 0,
        ignore_unavailable: true
      });
      const buckets = (_aggregations$cluster = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$cluster2 = aggregations.clusters) === null || _aggregations$cluster2 === void 0 ? void 0 : _aggregations$cluster2.buckets) !== null && _aggregations$cluster !== void 0 ? _aggregations$cluster : [];
      return {
        clusters: (0, _build_monitored_clusters.buildMonitoredClusters)(buckets, logger),
        execution: {
          timedOut
        }
      };
    } catch (err) {
      logger.error(`fetchMonitoredClusters: failed to fetch:\n${err.stack}`);
      return {
        execution: {
          errors: [err.message]
        }
      };
    }
  };
  const results = await Promise.all([getMonitoredClusters(monitoringIndex, (0, _monitored_clusters_query.monitoredClustersQuery)({
    timeRange,
    timeout
  })), getMonitoredClusters(monitoringIndex, (0, _monitored_clusters_query.persistentMetricsetsQuery)({
    timeout
  })), getMonitoredClusters(entSearchIndex, (0, _monitored_clusters_query.enterpriseSearchQuery)({
    timeRange,
    timeout
  }))]);
  return {
    clusters: (0, _lodash.merge)({}, ...results.map(({
      clusters
    }) => clusters)),
    execution: results.map(({
      execution
    }) => execution).reduce((acc, execution) => {
      return {
        timedOut: Boolean(acc.timedOut || execution.timedOut),
        errors: acc.errors.concat(execution.errors || [])
      };
    }, {
      timedOut: false,
      errors: []
    })
  };
};
exports.fetchMonitoredClusters = fetchMonitoredClusters;