"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDiskUsageNodeStats = fetchDiskUsageNodeStats;
var _lodash = require("lodash");
var _create_dataset_query_filter = require("./create_dataset_query_filter");
var _static_globals = require("../../static_globals");
var _constants = require("../../../common/constants");
var _get_index_patterns = require("../cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchDiskUsageNodeStats(esClient, clusters, duration, size, filterQuery) {
  const clustersIds = clusters.map(cluster => cluster.clusterUuid);
  const indexPatterns = (0, _get_index_patterns.getIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'node_stats',
    ccs: _constants.CCS_REMOTE_PATTERN
  });
  const params = {
    index: indexPatterns,
    filter_path: ['aggregations'],
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clustersIds
            }
          }, (0, _create_dataset_query_filter.createDatasetFilter)('node_stats', 'node_stats', (0, _get_index_patterns.getElasticsearchDataset)('node_stats')), {
            range: {
              timestamp: {
                gte: `now-${duration}`
              }
            }
          }]
        }
      },
      aggs: {
        clusters: {
          terms: {
            field: 'cluster_uuid',
            size,
            include: clustersIds
          },
          aggs: {
            nodes: {
              terms: {
                field: 'node_stats.node_id',
                size
              },
              aggs: {
                index: {
                  terms: {
                    field: '_index',
                    size: 1
                  }
                },
                total_in_bytes: {
                  max: {
                    field: 'node_stats.fs.total.total_in_bytes'
                  }
                },
                available_in_bytes: {
                  max: {
                    field: 'node_stats.fs.total.available_in_bytes'
                  }
                },
                usage_ratio_percentile: {
                  bucket_script: {
                    buckets_path: {
                      available_in_bytes: 'available_in_bytes',
                      total_in_bytes: 'total_in_bytes'
                    },
                    script: '100 - Math.floor((params.available_in_bytes / params.total_in_bytes) * 100)'
                  }
                },
                name: {
                  terms: {
                    field: 'source_node.name',
                    size: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  try {
    if (filterQuery) {
      const filterQueryObject = JSON.parse(filterQuery);
      params.body.query.bool.filter.push(filterQueryObject);
    }
  } catch (e) {
    // meh
  }
  const response = await esClient.search(params);
  const stats = [];
  if (!response.aggregations) {
    return stats;
  }

  // @ts-expect-error declare type for aggregations explicitly
  const {
    buckets: clusterBuckets
  } = response.aggregations.clusters;
  if (!(clusterBuckets !== null && clusterBuckets !== void 0 && clusterBuckets.length)) {
    return stats;
  }
  for (const clusterBucket of clusterBuckets) {
    for (const node of clusterBucket.nodes.buckets) {
      const indexName = (0, _lodash.get)(node, 'index.buckets[0].key', '');
      const diskUsage = Number((0, _lodash.get)(node, 'usage_ratio_percentile.value'));
      if (isNaN(diskUsage) || diskUsage === undefined || diskUsage === null) {
        continue;
      }
      stats.push({
        diskUsage,
        clusterUuid: clusterBucket.key,
        nodeId: node.key,
        nodeName: (0, _lodash.get)(node, 'name.buckets[0].key'),
        ccs: indexName.includes(':') ? indexName.split(':')[0] : null
      });
    }
  }
  return stats;
}