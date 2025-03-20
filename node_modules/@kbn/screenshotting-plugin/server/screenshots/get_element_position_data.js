"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementPositionAndAttributes = void 0;
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getElementPositionAndAttributes = async (browser, eventLogger, layout) => {
  var _elementsPositionAndA2;
  const {
    kbnLogger
  } = eventLogger;
  const spanEnd = eventLogger.logScreenshottingEvent('get element position data', _event_logger.Actions.GET_ELEMENT_POSITION_DATA, 'read');
  const {
    screenshot: screenshotSelector
  } = layout.selectors; // data-shared-items-container
  const screenshotAttributes = {
    title: 'data-title',
    description: 'data-description'
  };
  let elementsPositionAndAttributes;
  try {
    var _elementsPositionAndA;
    elementsPositionAndAttributes = await browser.evaluate({
      fn: (selector, attributes) => {
        const elements = Array.from(document.querySelectorAll(selector));
        const results = [];
        for (const element of elements) {
          const boundingClientRect = element.getBoundingClientRect();
          results.push({
            position: {
              boundingClientRect: {
                top: boundingClientRect.y,
                left: boundingClientRect.x,
                width: boundingClientRect.width,
                height: boundingClientRect.height
              },
              scroll: {
                x: window.scrollX,
                y: window.scrollY
              }
            },
            attributes: Object.keys(attributes).reduce((result, key) => {
              const attribute = attributes[key];
              result[key] = element.getAttribute(attribute);
              return result;
            }, {})
          });
        }
        return results;
      },
      args: [screenshotSelector, screenshotAttributes]
    }, {
      context: _constants.CONTEXT_ELEMENTATTRIBUTES
    }, kbnLogger);
    if (!((_elementsPositionAndA = elementsPositionAndAttributes) !== null && _elementsPositionAndA !== void 0 && _elementsPositionAndA.length)) {
      throw new Error(`An error occurred while reading the page for visualization panels: no panels were found.`);
    }
  } catch (err) {
    kbnLogger.error(err);
    eventLogger.error(err, _event_logger.Actions.GET_ELEMENT_POSITION_DATA);
    elementsPositionAndAttributes = null;
    // no throw
  }

  spanEnd({
    element_positions: (_elementsPositionAndA2 = elementsPositionAndAttributes) === null || _elementsPositionAndA2 === void 0 ? void 0 : _elementsPositionAndA2.length
  });
  return elementsPositionAndAttributes;
};
exports.getElementPositionAndAttributes = getElementPositionAndAttributes;