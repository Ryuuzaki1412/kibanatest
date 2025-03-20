"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReportingUsageCollector = getReportingUsageCollector;
exports.registerReportingUsageCollector = registerReportingUsageCollector;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _get_reporting_usage = require("./get_reporting_usage");
var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * @return {Object} kibana usage stats type collection object
 */
function getReportingUsageCollector(usageCollection, getLicense, exportTypesRegistry, isReady) {
  return usageCollection.makeUsageCollector({
    type: 'reporting',
    fetch: ({
      esClient
    }) => {
      return (0, _get_reporting_usage.getReportingUsage)(getLicense, esClient, exportTypesRegistry);
    },
    isReady,
    schema: _schema.reportingSchema
  });
}
function registerReportingUsageCollector(reporting, usageCollection) {
  if (!usageCollection) {
    return;
  }
  const exportTypesRegistry = reporting.getExportTypesRegistry();
  const getLicense = async () => {
    const {
      licensing
    } = await reporting.getPluginStartDeps();
    return await (0, _rxjs.firstValueFrom)(licensing.license$.pipe((0, _operators.map)(({
      isAvailable,
      type
    }) => ({
      isAvailable: () => isAvailable,
      license: {
        getType: () => type
      }
    }))));
  };
  const collectionIsReady = reporting.pluginStartsUp.bind(reporting);
  const collector = getReportingUsageCollector(usageCollection, getLicense, exportTypesRegistry, collectionIsReady);
  usageCollection.registerCollector(collector);
}