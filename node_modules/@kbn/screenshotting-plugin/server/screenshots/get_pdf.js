"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPdf = getPdf;
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getPdf(browser, logger, title, options) {
  logger.kbnLogger.info('printing PDF');
  const spanEnd = logger.logPdfEvent('printing A4 PDF', _event_logger.Actions.PRINT_A4_PDF, 'output');
  const result = [{
    data: await browser.printA4Pdf({
      title,
      ...options
    }),
    title: null,
    description: null
  }];
  spanEnd();
  return result;
}