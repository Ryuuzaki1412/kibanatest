"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRenderErrors = void 0;
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRenderErrors = async (browser, eventLogger, layout) => {
  const {
    kbnLogger
  } = eventLogger;
  const spanEnd = eventLogger.logScreenshottingEvent('look for render errors', _event_logger.Actions.GET_RENDER_ERRORS, 'read');
  let errorsFound;
  try {
    var _errorsFound;
    errorsFound = await browser.evaluate({
      fn: (errorSelector, errorAttribute) => {
        const visualizations = Array.from(document.querySelectorAll(errorSelector));
        const errors = [];
        visualizations.forEach(visualization => {
          const errorMessage = visualization.getAttribute(errorAttribute);
          if (errorMessage) {
            errors.push(errorMessage);
          }
        });
        return errors.length ? errors : undefined;
      },
      args: [layout.selectors.renderError, layout.selectors.renderErrorAttribute]
    }, {
      context: _constants.CONTEXT_GETRENDERERRORS
    }, kbnLogger);
    const renderErrors = (_errorsFound = errorsFound) === null || _errorsFound === void 0 ? void 0 : _errorsFound.length;
    if (renderErrors) {
      kbnLogger.warn(`Found ${renderErrors} error messages. See report object for more information.`);
    }
    spanEnd({
      render_errors: renderErrors
    });
  } catch (error) {
    kbnLogger.error(error);
    eventLogger.error(error, _event_logger.Actions.GET_RENDER_ERRORS);
    throw error;
  }
  return errorsFound;
};
exports.getRenderErrors = getRenderErrors;