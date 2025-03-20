"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrometheusExporter = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _sdkMetricsBase = require("@opentelemetry/sdk-metrics-base");
var _exporterPrometheus = require("@opentelemetry/exporter-prometheus");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class PrometheusExporter extends _sdkMetricsBase.MetricReader {
  constructor(config = {}) {
    super();
    (0, _defineProperty2.default)(this, "prefix", void 0);
    (0, _defineProperty2.default)(this, "appendTimestamp", void 0);
    (0, _defineProperty2.default)(this, "serializer", void 0);
    this.prefix = config.prefix || _exporterPrometheus.PrometheusExporter.DEFAULT_OPTIONS.prefix;
    this.appendTimestamp = typeof config.appendTimestamp === 'boolean' ? config.appendTimestamp : _exporterPrometheus.PrometheusExporter.DEFAULT_OPTIONS.appendTimestamp;
    this.serializer = new _exporterPrometheus.PrometheusSerializer(this.prefix, this.appendTimestamp);
  }
  selectAggregationTemporality() {
    return _sdkMetricsBase.AggregationTemporality.CUMULATIVE;
  }
  onForceFlush() {
    return Promise.resolve(undefined);
  }
  onShutdown() {
    return Promise.resolve(undefined);
  }

  /**
   * Responds to incoming message with current state of all metrics.
   */
  async exportMetrics(res) {
    try {
      const collectionResult = await this.collect();
      const {
        resourceMetrics,
        errors
      } = collectionResult;
      if (errors.length) {
        return res.customError({
          statusCode: 500,
          body: `PrometheusExporter: Metrics collection errors ${errors}`
        });
      }
      const result = this.serializer.serialize(resourceMetrics);
      if (result === '') {
        return res.noContent();
      }
      return res.ok({
        body: result
      });
    } catch (error) {
      return res.customError({
        statusCode: 500,
        body: {
          message: `PrometheusExporter: Failed to export metrics ${error}`
        }
      });
    }
  }
}
exports.PrometheusExporter = PrometheusExporter;