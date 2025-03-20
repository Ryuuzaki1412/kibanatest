"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleMonitoringService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _monitoring = require("../lib/monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class RuleMonitoringService {
  constructor() {
    (0, _defineProperty2.default)(this, "monitoring", (0, _monitoring.getDefaultMonitoring)(new Date().toISOString()));
    (0, _defineProperty2.default)(this, "buildExecutionDurationPercentiles", () => {
      const {
        history
      } = this.monitoring.run;
      return (0, _monitoring.getExecutionDurationPercentiles)(history);
    });
  }
  setLastRunMetricsDuration(duration) {
    this.monitoring.run.last_run.metrics.duration = duration;
  }
  setMonitoring(monitoringFromSO) {
    if (monitoringFromSO) {
      this.monitoring = monitoringFromSO;
    }
  }
  getMonitoring() {
    return this.monitoring;
  }
  addHistory({
    duration,
    hasError = true,
    runDate
  }) {
    const date = runDate !== null && runDate !== void 0 ? runDate : new Date();
    const monitoringHistory = {
      success: true,
      timestamp: date.getTime()
    };
    if (null != duration) {
      monitoringHistory.duration = duration;
      this.setLastRunMetricsDuration(duration);
    }
    if (hasError) {
      monitoringHistory.success = false;
    }
    this.monitoring.run.last_run.timestamp = date.toISOString();
    this.monitoring.run.history.push(monitoringHistory);
    this.monitoring.run.calculated_metrics = {
      success_ratio: this.buildExecutionSuccessRatio(),
      ...this.buildExecutionDurationPercentiles()
    };
  }
  getLastRunMetricsSetters() {
    return {
      setLastRunMetricsTotalSearchDurationMs: this.setLastRunMetricsTotalSearchDurationMs.bind(this),
      setLastRunMetricsTotalIndexingDurationMs: this.setLastRunMetricsTotalIndexingDurationMs.bind(this),
      setLastRunMetricsTotalAlertsDetected: this.setLastRunMetricsTotalAlertsDetected.bind(this),
      setLastRunMetricsTotalAlertsCreated: this.setLastRunMetricsTotalAlertsCreated.bind(this),
      setLastRunMetricsGapDurationS: this.setLastRunMetricsGapDurationS.bind(this)
    };
  }
  setLastRunMetricsTotalSearchDurationMs(totalSearchDurationMs) {
    this.monitoring.run.last_run.metrics.total_search_duration_ms = totalSearchDurationMs;
  }
  setLastRunMetricsTotalIndexingDurationMs(totalIndexingDurationMs) {
    this.monitoring.run.last_run.metrics.total_indexing_duration_ms = totalIndexingDurationMs;
  }
  setLastRunMetricsTotalAlertsDetected(totalAlertDetected) {
    this.monitoring.run.last_run.metrics.total_alerts_detected = totalAlertDetected;
  }
  setLastRunMetricsTotalAlertsCreated(totalAlertCreated) {
    this.monitoring.run.last_run.metrics.total_alerts_created = totalAlertCreated;
  }
  setLastRunMetricsGapDurationS(gapDurationS) {
    this.monitoring.run.last_run.metrics.gap_duration_s = gapDurationS;
  }
  buildExecutionSuccessRatio() {
    const {
      history
    } = this.monitoring.run;
    return history.filter(({
      success
    }) => success).length / history.length;
  }
}
exports.RuleMonitoringService = RuleMonitoringService;