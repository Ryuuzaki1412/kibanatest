"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openUrl = void 0;
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const openUrl = async (browser, eventLogger, timeout, index, url, context, headers) => {
  const {
    kbnLogger
  } = eventLogger;
  const spanEnd = eventLogger.logScreenshottingEvent('open url', _event_logger.Actions.OPEN_URL, 'wait');

  // If we're moving to another page in the app, we'll want to wait for the app to tell us
  // it's loaded the next page.
  const page = index + 1;
  const waitForSelector = page > 1 ? `[data-shared-page="${page}"]` : _constants.DEFAULT_PAGELOAD_SELECTOR;
  try {
    await browser.open(url, {
      context,
      headers,
      waitForSelector,
      timeout
    }, kbnLogger);

    // Debug logging for viewport size and resizing
    await browser.evaluate({
      fn() {
        // eslint-disable-next-line no-console
        console.log(`Navigating URL with viewport size: width=${window.innerWidth} height=${window.innerHeight} scaleFactor:${window.devicePixelRatio}`);
        window.addEventListener('resize', () => {
          // eslint-disable-next-line no-console
          console.log(`Detected a viewport resize: width=${window.innerWidth} height=${window.innerHeight} scaleFactor:${window.devicePixelRatio}`);
        });
      },
      args: []
    }, {
      context: _constants.CONTEXT_DEBUG
    }, kbnLogger);
  } catch (err) {
    kbnLogger.error(err);
    const newError = new Error(`An error occurred when trying to open the Kibana URL: ${err.message}`);
    eventLogger.error(newError, _event_logger.Actions.OPEN_URL);
    throw newError;
  }
  spanEnd();
};
exports.openUrl = openUrl;