"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUiMetricUsageCollector = registerUiMetricUsageCollector;
var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerUiMetricUsageCollector(usageCollection, registerType, getSavedObjectsClient) {
  registerType({
    name: 'ui-metric',
    hidden: false,
    namespaceType: 'agnostic',
    mappings: {
      properties: {
        count: {
          type: 'integer'
        }
      }
    }
  });
  const collector = usageCollection.makeUsageCollector({
    type: 'ui_metric',
    schema: _schema.uiMetricSchema,
    fetch: async () => {
      const savedObjectsClient = getSavedObjectsClient();
      if (typeof savedObjectsClient === 'undefined') {
        return;
      }
      const finder = savedObjectsClient.createPointInTimeFinder({
        type: 'ui-metric',
        fields: ['count'],
        perPage: 1000
      });
      const uiMetricsByAppName = {};
      for await (const {
        saved_objects: rawUiMetrics
      } of finder.find()) {
        rawUiMetrics.forEach(rawUiMetric => {
          const {
            id,
            attributes: {
              count
            }
          } = rawUiMetric;
          const [appName, ...metricType] = id.split(':');
          const pair = {
            key: metricType.join(':'),
            value: count
          };
          uiMetricsByAppName[appName] = [...(uiMetricsByAppName[appName] || []), pair];
        });
      }
      return uiMetricsByAppName;
    },
    isReady: () => typeof getSavedObjectsClient() !== 'undefined'
  });
  usageCollection.registerCollector(collector);
}