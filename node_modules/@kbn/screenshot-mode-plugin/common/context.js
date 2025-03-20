"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScreenshotContext = getScreenshotContext;
exports.setScreenshotContext = setScreenshotContext;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// **PLEASE NOTE**
// The functionality in this file targets a browser environment AND is intended to be used both in public and server.
// For instance, reporting uses these functions when starting puppeteer to set the current browser into "screenshot" mode.

/**
 * Stores a value in the screenshotting context.
 * @param key Context key to set.
 * @param value Value to set.
 */
function setScreenshotContext(key, value) {
  // Literal value to prevent adding an external reference
  const KBN_SCREENSHOT_CONTEXT = '__KBN_SCREENSHOT_CONTEXT__';
  if (!window[KBN_SCREENSHOT_CONTEXT]) {
    Object.defineProperty(window, KBN_SCREENSHOT_CONTEXT, {
      enumerable: true,
      writable: true,
      configurable: false,
      value: {}
    });
  }
  window[KBN_SCREENSHOT_CONTEXT][key] = value;
}

/**
 * Retrieves a value from the screenshotting context.
 * @param key Context key to get.
 * @param defaultValue Value to return if the key is not found.
 * @return The value stored in the screenshotting context.
 */
function getScreenshotContext(key, defaultValue) {
  var _ref, _window$KBN_SCREENSHO;
  // Literal value to prevent adding an external reference
  const KBN_SCREENSHOT_CONTEXT = '__KBN_SCREENSHOT_CONTEXT__';
  return (_ref = (_window$KBN_SCREENSHO = window[KBN_SCREENSHOT_CONTEXT]) === null || _window$KBN_SCREENSHO === void 0 ? void 0 : _window$KBN_SCREENSHO[key]) !== null && _ref !== void 0 ? _ref : defaultValue;
}