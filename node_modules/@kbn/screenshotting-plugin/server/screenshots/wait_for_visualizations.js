"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForVisualizations = void 0;
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCompletedItemsCount = ({
  context,
  count,
  renderCompleteSelector
}) => {
  const {
    length
  } = document.querySelectorAll(renderCompleteSelector);

  // eslint-disable-next-line no-console
  console.debug(`evaluate ${context}: waitng for ${count} elements, got ${length}.`);
  return length >= count;
};

/*
 * 1. Wait for the visualization metadata to be found in the DOM
 * 2. Read the metadata for the number of visualization items
 * 3. Wait for the render complete event to be fired once for each item
 */
const waitForVisualizations = async (browser, eventLogger, timeout, toEqual, layout) => {
  const {
    kbnLogger
  } = eventLogger;
  const spanEnd = eventLogger.logScreenshottingEvent('waiting for each visualization to complete rendering', _event_logger.Actions.WAIT_VISUALIZATIONS, 'wait');
  const {
    renderComplete: renderCompleteSelector
  } = layout.selectors;
  kbnLogger.debug(`waiting for ${toEqual} rendered elements to be in the DOM`);
  try {
    await browser.waitFor({
      fn: getCompletedItemsCount,
      args: [{
        renderCompleteSelector,
        context: _constants.CONTEXT_WAITFORELEMENTSTOBEINDOM,
        count: toEqual
      }],
      timeout
    });
    kbnLogger.debug(`found ${toEqual} rendered elements in the DOM`);
  } catch (err) {
    kbnLogger.error(err);
    const newError = new Error(`An error occurred when trying to wait for ${toEqual} visualizations to finish rendering. ${err.message}`);
    eventLogger.error(newError, _event_logger.Actions.WAIT_VISUALIZATIONS);
    throw newError;
  }
  spanEnd();
};
exports.waitForVisualizations = waitForVisualizations;