"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ChromiumArchivePaths", {
  enumerable: true,
  get: function () {
    return _paths.ChromiumArchivePaths;
  }
});
Object.defineProperty(exports, "DEFAULT_VIEWPORT", {
  enumerable: true,
  get: function () {
    return _driver_factory.DEFAULT_VIEWPORT;
  }
});
Object.defineProperty(exports, "HeadlessChromiumDriver", {
  enumerable: true,
  get: function () {
    return _driver.HeadlessChromiumDriver;
  }
});
Object.defineProperty(exports, "HeadlessChromiumDriverFactory", {
  enumerable: true,
  get: function () {
    return _driver_factory.HeadlessChromiumDriverFactory;
  }
});
exports.getDisallowedOutgoingUrlError = exports.getChromiumDisconnectedError = void 0;
var _common = require("../../../common");
var _driver = require("./driver");
var _driver_factory = require("./driver_factory");
var _paths = require("./paths");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getChromiumDisconnectedError = () => new _common.errors.BrowserClosedUnexpectedly('Browser was closed unexpectedly! Check the server logs for more info.');
exports.getChromiumDisconnectedError = getChromiumDisconnectedError;
const getDisallowedOutgoingUrlError = interceptedUrl => new _common.errors.DisallowedOutgoingUrl(`Received disallowed outgoing URL [${interceptedUrl}]! Check the server logs for more info.`);
exports.getDisallowedOutgoingUrlError = getDisallowedOutgoingUrlError;