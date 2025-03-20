"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUpgradeAssistantMetrics = fetchUpgradeAssistantMetrics;
exports.registerUpgradeAssistantUsageCollector = registerUpgradeAssistantUsageCollector;
var _es_deprecation_logging_apis = require("../es_deprecation_logging_apis");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getDeprecationLoggingStatusValue(esClient) {
  try {
    const loggerDeprecationCallResult = await esClient.cluster.getSettings({
      include_defaults: true
    });
    return (0, _es_deprecation_logging_apis.isDeprecationLogIndexingEnabled)(loggerDeprecationCallResult) && (0, _es_deprecation_logging_apis.isDeprecationLoggingEnabled)(loggerDeprecationCallResult);
  } catch (e) {
    return false;
  }
}
async function fetchUpgradeAssistantMetrics({
  client: esClient
}) {
  const deprecationLoggingStatusValue = await getDeprecationLoggingStatusValue(esClient.asInternalUser);
  return {
    features: {
      deprecation_logging: {
        enabled: deprecationLoggingStatusValue
      }
    }
  };
}
function registerUpgradeAssistantUsageCollector({
  elasticsearch,
  usageCollection
}) {
  const upgradeAssistantUsageCollector = usageCollection.makeUsageCollector({
    type: 'upgrade-assistant-telemetry',
    isReady: () => true,
    schema: {
      features: {
        deprecation_logging: {
          enabled: {
            type: 'boolean',
            _meta: {
              description: 'Whether user has enabled Elasticsearch deprecation logging'
            }
          }
        }
      }
    },
    fetch: async () => fetchUpgradeAssistantMetrics(elasticsearch)
  });
  usageCollection.registerCollector(upgradeAssistantUsageCollector);
}