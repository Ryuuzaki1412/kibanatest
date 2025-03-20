"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
Object.defineProperty(exports, "createConfig", {
  enumerable: true,
  get: function () {
    return _create_config.createConfig;
  }
});
exports.durationToNumber = void 0;
var _schema = require("./schema");
var _create_config = require("./create_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper function
 */
const durationToNumber = value => {
  if (typeof value === 'number') {
    return value;
  }
  return value.asMilliseconds();
};

/**
 * Screenshotting plugin configuration schema.
 */
exports.durationToNumber = durationToNumber;
const config = {
  schema: _schema.ConfigSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('xpack.reporting.capture.networkPolicy', 'xpack.screenshotting.networkPolicy', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.browser.autoDownload', 'xpack.screenshotting.browser.autoDownload', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.browser.chromium.inspect', 'xpack.screenshotting.browser.chromium.inspect', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.browser.chromium.disableSandbox', 'xpack.screenshotting.browser.chromium.disableSandbox', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.browser.chromium.proxy.enabled', 'xpack.screenshotting.browser.chromium.proxy.enabled', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.browser.chromium.proxy.server', 'xpack.screenshotting.browser.chromium.proxy.server', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.browser.chromium.proxy.bypass', 'xpack.screenshotting.browser.chromium.proxy.bypass', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.timeouts.openUrl', 'xpack.screenshotting.capture.timeouts.openUrl', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.timeouts.renderComplete', 'xpack.screenshotting.capture.timeouts.renderComplete', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.timeouts.waitForElements', 'xpack.screenshotting.capture.timeouts.waitForElements', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.zoom', 'xpack.screenshotting.capture.zoom', {
    level: 'warning'
  }), renameFromRoot('xpack.reporting.capture.loadDelay', 'xpack.screenshotting.capture.loadDelay', {
    level: 'warning'
  })],
  exposeToUsage: {
    networkPolicy: false,
    // show as [redacted]
    capture: {
      timeouts: {
        openUrl: true,
        renderComplete: true,
        waitForElements: true
      },
      loadDelay: true,
      zoom: true
    }
  }
};
exports.config = config;