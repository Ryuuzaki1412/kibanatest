"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pngsToPdf = pngsToPdf;
var _event_logger = require("../../../screenshots/event_logger");
var _pdfmaker = require("./pdfmaker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function pngsToPdf({
  results,
  layout,
  logo,
  title,
  packageInfo,
  eventLogger
}) {
  const {
    kbnLogger
  } = eventLogger;
  const transactionEnd = eventLogger.startTransaction(_event_logger.Transactions.PDF);
  let buffer = null;
  let pdfMaker = null;
  try {
    var _buffer$byteLength, _buffer;
    pdfMaker = new _pdfmaker.PdfMaker(layout, logo, packageInfo, kbnLogger);
    if (title) {
      pdfMaker.setTitle(title);
    }
    results.forEach(result => {
      result.screenshots.forEach(png => {
        var _pdfMaker, _png$title, _png$description;
        const spanEnd = eventLogger.logPdfEvent('add image to PDF file', _event_logger.Actions.ADD_IMAGE, 'output');
        (_pdfMaker = pdfMaker) === null || _pdfMaker === void 0 ? void 0 : _pdfMaker.addImage(png.data, {
          title: (_png$title = png.title) !== null && _png$title !== void 0 ? _png$title : undefined,
          description: (_png$description = png.description) !== null && _png$description !== void 0 ? _png$description : undefined
        });
        spanEnd();
      });
    });
    const spanEnd = eventLogger.logPdfEvent('compile PDF file', _event_logger.Actions.COMPILE, 'output');
    buffer = await pdfMaker.generate();
    spanEnd();
    const byteLength = (_buffer$byteLength = (_buffer = buffer) === null || _buffer === void 0 ? void 0 : _buffer.byteLength) !== null && _buffer$byteLength !== void 0 ? _buffer$byteLength : 0;
    transactionEnd({
      labels: {
        byte_length_pdf: byteLength,
        pdf_pages: pdfMaker.getPageCount()
      }
    });
  } catch (error) {
    kbnLogger.error(error);
    eventLogger.error(error, _event_logger.Actions.COMPILE);
    throw error;
  }
  return {
    buffer: Buffer.from(buffer.buffer),
    pages: pdfMaker.getPageCount()
  };
}