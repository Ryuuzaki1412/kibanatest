"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForRenderComplete = void 0;
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const waitForRenderComplete = async (browser, eventLogger, layout) => {
  const spanEnd = eventLogger.logScreenshottingEvent('wait for render complete', _event_logger.Actions.WAIT_RENDER, 'wait');
  await browser.evaluate({
    fn: async selector => {
      const visualizations = document.querySelectorAll(selector);
      const visCount = visualizations.length;
      const renderedTasks = [];
      function waitForRender(visualization) {
        return new Promise(resolve => {
          visualization.addEventListener('renderComplete', () => resolve());
        });
      }
      for (let i = 0; i < visCount; i++) {
        const visualization = visualizations[i];
        const isRendered = visualization.getAttribute('data-render-complete');
        if (isRendered === 'false') {
          renderedTasks.push(waitForRender(visualization));
        }
      }
      return await Promise.all(renderedTasks);
    },
    args: [layout.selectors.renderComplete]
  }, {
    context: _constants.CONTEXT_WAITFORRENDER
  }, eventLogger.kbnLogger);
  spanEnd();
};
exports.waitForRenderComplete = waitForRenderComplete;