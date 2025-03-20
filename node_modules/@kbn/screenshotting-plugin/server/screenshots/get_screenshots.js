"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScreenshots = void 0;
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Resize the viewport to contain the element to capture.
 *
 * @async
 * @param {HeadlessChromiumDriver} browser - used for its methods to control the page
 * @param {ElementsPositionAndAttribute['position']} position - position data for the element to capture
 * @param {Layout} layout - used for client-side layout data from the job params
 * @param {Logger} logger
 */
const resizeViewport = async (browser, position, layout, logger) => {
  const {
    boundingClientRect,
    scroll
  } = position;

  // Using width from the layout is preferred, it avoids the elements moving around horizontally,
  // which would invalidate the position data that was passed in.
  const width = layout.width || boundingClientRect.left + scroll.x + boundingClientRect.width;
  await browser.setViewport({
    width,
    height: boundingClientRect.top + scroll.y + boundingClientRect.height,
    zoom: layout.getBrowserZoom()
  }, logger);
};

/**
 * Get screenshots of multiple areas of the page
 */
const getScreenshots = async (browser, eventLogger, options) => {
  const {
    kbnLogger
  } = eventLogger;
  const {
    elements,
    layout
  } = options;
  kbnLogger.info(`taking screenshots`);
  const screenshots = [];
  try {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const {
        position,
        attributes
      } = element;
      await resizeViewport(browser, position, layout, eventLogger.kbnLogger);
      const endScreenshot = eventLogger.logScreenshottingEvent('screenshot capture', _event_logger.Actions.GET_SCREENSHOT, 'read', eventLogger.getPixelsFromElementPosition(position));
      const data = await browser.screenshot({
        elementPosition: position,
        layout: options.layout,
        error: options.error
      });
      if (!(data !== null && data !== void 0 && data.byteLength)) {
        throw new Error(`Failure in getScreenshots! Screenshot data is void`);
      }
      screenshots.push({
        data,
        title: attributes.title,
        description: attributes.description
      });
      endScreenshot({
        byte_length: data.byteLength
      });
    }
  } catch (error) {
    kbnLogger.error(error);
    eventLogger.error(error, _event_logger.Actions.GET_SCREENSHOT);
    throw error;
  }
  kbnLogger.info(`screenshots taken: ${screenshots.length}`);
  return screenshots;
};
exports.getScreenshots = getScreenshots;