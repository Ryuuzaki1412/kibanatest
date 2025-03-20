"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeRange = void 0;
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTimeRange = async (browser, eventLogger, layout) => {
  const spanEnd = eventLogger.logScreenshottingEvent('looking for time range', _event_logger.Actions.GET_TIMERANGE, 'read');
  const timeRange = await browser.evaluate({
    fn: durationAttribute => {
      const durationElement = document.querySelector(`[${durationAttribute}]`);
      if (!durationElement) {
        return null;
      }
      const duration = durationElement.getAttribute(durationAttribute);
      if (!duration) {
        return null;
      }
      return duration; // user-friendly date string
    },

    args: [layout.selectors.timefilterDurationAttribute]
  }, {
    context: _constants.CONTEXT_GETTIMERANGE
  }, eventLogger.kbnLogger);
  if (timeRange) {
    eventLogger.kbnLogger.info(`timeRange: ${timeRange}`);
  }
  spanEnd();
  return timeRange;
};
exports.getTimeRange = getTimeRange;