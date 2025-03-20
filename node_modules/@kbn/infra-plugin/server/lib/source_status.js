"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraSourceStatus = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class InfraSourceStatus {
  constructor(adapter, libs) {
    this.adapter = adapter;
    this.libs = libs;
  }
  async getMetricIndexNames(requestContext, sourceId) {
    const soClient = (await requestContext.core).savedObjects.client;
    const sourceConfiguration = await this.libs.sources.getSourceConfiguration(soClient, sourceId);
    const indexNames = await this.adapter.getIndexNames(requestContext, sourceConfiguration.configuration.metricAlias);
    return indexNames;
  }
  async hasMetricAlias(requestContext, sourceId) {
    const soClient = (await requestContext.core).savedObjects.client;
    const sourceConfiguration = await this.libs.sources.getSourceConfiguration(soClient, sourceId);
    const hasAlias = await this.adapter.hasAlias(requestContext, sourceConfiguration.configuration.metricAlias);
    return hasAlias;
  }
  async hasMetricIndices(requestContext, sourceId) {
    const soClient = (await requestContext.core).savedObjects.client;
    const sourceConfiguration = await this.libs.sources.getSourceConfiguration(soClient, sourceId);
    const indexStatus = await this.adapter.getIndexStatus(requestContext, sourceConfiguration.configuration.metricAlias);
    return indexStatus !== 'missing';
  }
}
exports.InfraSourceStatus = InfraSourceStatus;