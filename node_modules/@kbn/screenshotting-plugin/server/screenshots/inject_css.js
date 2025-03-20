"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectCustomCss = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _util = require("util");
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fsp = {
  readFile: (0, _util.promisify)(_fs.default.readFile)
};
const injectCustomCss = async (browser, eventLogger, layout) => {
  const filePath = layout.getCssOverridesPath();
  if (!filePath) {
    return;
  }
  const {
    kbnLogger
  } = eventLogger;
  const spanEnd = eventLogger.logScreenshottingEvent('inject CSS into the page', _event_logger.Actions.INJECT_CSS, 'correction');
  const buffer = await fsp.readFile(filePath);
  try {
    await browser.evaluate({
      fn: css => {
        const node = document.createElement('style');
        node.type = 'text/css';
        node.innerHTML = css; // eslint-disable-line no-unsanitized/property
        document.getElementsByTagName('head')[0].appendChild(node);
      },
      args: [buffer.toString()]
    }, {
      context: _constants.CONTEXT_INJECTCSS
    }, kbnLogger);
  } catch (err) {
    kbnLogger.error(err);
    eventLogger.error(err, _event_logger.Actions.INJECT_CSS);
    throw new Error(`An error occurred when trying to update Kibana CSS for reporting. ${err.message}`);
  }
  spanEnd();
};
exports.injectCustomCss = injectCustomCss;