"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChartType = getChartType;
var _charts = require("../constants/charts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get the chart type based on its configuration
 * @param config
 */
function getChartType(config) {
  let chartType = _charts.CHART_TYPE.SINGLE_METRIC;
  if (config.functionDescription === 'lat_long' || config.mapData !== undefined) {
    return _charts.CHART_TYPE.GEO_MAP;
  }
  if (config.functionDescription === 'rare' && config.entityFields.some(f => f.fieldType === 'over') === false) {
    chartType = _charts.CHART_TYPE.EVENT_DISTRIBUTION;
  } else if (config.functionDescription !== 'rare' && config.entityFields.some(f => f.fieldType === 'over') && config.metricFunction !== null // Event distribution chart relies on the ML function mapping to an ES aggregation
  ) {
    chartType = _charts.CHART_TYPE.POPULATION_DISTRIBUTION;
  }
  if (chartType === _charts.CHART_TYPE.EVENT_DISTRIBUTION || chartType === _charts.CHART_TYPE.POPULATION_DISTRIBUTION) {
    // Check that the config does not use script fields defined in the datafeed config.
    if (config.datafeedConfig !== undefined && config.datafeedConfig.script_fields !== undefined) {
      const scriptFields = Object.keys(config.datafeedConfig.script_fields);
      const checkFields = config.entityFields.map(entity => entity.fieldName);
      if (config.metricFieldName) {
        checkFields.push(config.metricFieldName);
      }
      const usesScriptFields = checkFields.find(fieldName => scriptFields.includes(fieldName)) !== undefined;
      if (usesScriptFields === true) {
        // Only single metric chart type supports query of model plot data.
        chartType = _charts.CHART_TYPE.SINGLE_METRIC;
      }
    }
  }
  return chartType;
}