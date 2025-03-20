"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PdfMaker = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path = _interopRequireDefault(require("path"));
var _worker_threads = require("worker_threads");
var _common = require("../../../../common");
var _constants = require("./constants");
var _get_doc_options = require("./get_doc_options");
var _get_font = require("./get_font");
require("./worker_dependencies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Ensure that all dependencies are included in the release bundle.

class PdfMaker {
  /**
   * The maximum heap size for old memory region of the worker thread.
   *
   * @note We need to provide a sane number given that we need to load a
   * node environment for TS compilation (dev-builds only), some library code
   * and buffers that result from generating a PDF.
   *
   * Local testing indicates that to trigger an OOM event for the worker we need
   * to exhaust not only heap but also any compression optimization and fallback
   * swap space.
   *
   * With this value we are able to generate PDFs in excess of 5000x5000 pixels
   * at which point issues other than memory start to show like glitches in the
   * image.
   */

  /**
   * The maximum heap size for young memory region of the worker thread.
   *
   * @note we leave this 'undefined' to use the Node.js default value.
   * @note we set this to a low value to trigger an OOM event sooner for the worker
   * in test scenarios.
   */

  constructor(layout, logo, {
    dist
  }, logger) {
    (0, _defineProperty2.default)(this, "title", void 0);
    (0, _defineProperty2.default)(this, "content", void 0);
    (0, _defineProperty2.default)(this, "worker", void 0);
    (0, _defineProperty2.default)(this, "pageCount", 0);
    (0, _defineProperty2.default)(this, "transferList", []);
    (0, _defineProperty2.default)(this, "workerModulePath", void 0);
    (0, _defineProperty2.default)(this, "workerMaxOldHeapSizeMb", 128);
    (0, _defineProperty2.default)(this, "workerMaxYoungHeapSizeMb", undefined);
    this.layout = layout;
    this.logo = logo;
    this.logger = logger;
    this.title = '';
    this.content = [];

    // running in dist: `worker.ts` becomes `worker.js`
    // running in source: `worker_src_harness.ts` needs to be wrapped in JS and have a ts-node environment initialized.
    this.workerModulePath = _path.default.resolve(__dirname, dist ? './worker.js' : './worker_src_harness.js');
  }
  addPageContents(contents) {
    this.content.push(
    // Insert a page break after each content item
    (this.content.length > 1 ? [{
      text: '',
      pageBreak: 'after'
    }] : []).concat(contents));
  }
  addBrandedImage(img, {
    title = '',
    description = ''
  }) {
    const contents = [];
    if (title && title.length > 0) {
      contents.push({
        text: title,
        style: 'heading',
        font: (0, _get_font.getFont)(title),
        noWrap: false
      });
    }
    if (description && description.length > 0) {
      contents.push({
        text: description,
        style: 'subheading',
        font: (0, _get_font.getFont)(description),
        noWrap: false
      });
    }
    const wrappedImg = {
      table: {
        body: [[img]]
      },
      layout: _get_doc_options.REPORTING_TABLE_LAYOUT
    };
    contents.push(wrappedImg);
    this.addPageContents(contents);
  }
  addImage(image, opts = {
    title: '',
    description: ''
  }) {
    this.logger.debug(`Adding image to PDF. Image size: ${image.byteLength}`); // prettier-ignore
    const size = this.layout.getPdfImageSize();
    const img = {
      // The typings are incomplete for the image property.
      // It's possible to pass a Buffer as the image data.
      // @see https://github.com/bpampuch/pdfmake/blob/0.2/src/printer.js#L654
      image,
      alignment: 'center',
      height: size.height,
      width: size.width
    };
    this.transferList.push(image.buffer);
    if (this.layout.useReportingBranding) {
      return this.addBrandedImage(img, opts);
    }
    this.addPageContents([img]);
  }
  setTitle(title) {
    this.title = title;
  }
  getGeneratePdfRequestData() {
    return {
      layout: {
        hasHeader: this.layout.hasHeader,
        hasFooter: this.layout.hasFooter,
        orientation: this.layout.getPdfPageOrientation(),
        useReportingBranding: this.layout.useReportingBranding,
        pageSize: this.layout.getPdfPageSize({
          pageMarginTop: _constants.pageMarginTop,
          pageMarginBottom: _constants.pageMarginBottom,
          pageMarginWidth: _constants.pageMarginWidth,
          tableBorderWidth: _constants.tableBorderWidth,
          headingHeight: _constants.headingHeight,
          subheadingHeight: _constants.subheadingHeight
        })
      },
      title: this.title,
      logo: this.logo,
      content: this.content
    };
  }
  createWorker(port) {
    const workerData = {
      port
    };
    return new _worker_threads.Worker(this.workerModulePath, {
      workerData,
      resourceLimits: {
        maxYoungGenerationSizeMb: this.workerMaxYoungHeapSizeMb,
        maxOldGenerationSizeMb: this.workerMaxOldHeapSizeMb
      },
      transferList: [port]
    });
  }
  async cleanupWorker() {
    if (this.worker) {
      await this.worker.terminate().catch(); // best effort
      this.worker = undefined;
    }
  }
  async generate() {
    if (this.worker) throw new Error('PDF generation already in progress!');
    this.logger.info(`Compiling PDF using "${this.layout.id}" layout...`);
    try {
      return await new Promise((resolve, reject) => {
        const {
          port1: myPort,
          port2: theirPort
        } = new _worker_threads.MessageChannel();
        this.worker = this.createWorker(theirPort);
        this.worker.on('error', workerError => {
          if (workerError.code === 'ERR_WORKER_OUT_OF_MEMORY') {
            reject(new _common.errors.PdfWorkerOutOfMemoryError(workerError.message));
          } else {
            reject(workerError);
          }
        });
        this.worker.on('exit', () => {});

        // We expect one message from the worker generating the PDF buffer.
        myPort.on('message', ({
          error,
          data
        }) => {
          if (error) {
            reject(new Error(`PDF worker returned the following error: ${error}`));
            return;
          }
          if (!data) {
            reject(new Error(`Worker did not generate a PDF!`));
            return;
          }
          this.pageCount = data.metrics.pages;
          resolve(data.buffer);
        });

        // Send the request
        const generatePdfRequest = {
          data: this.getGeneratePdfRequestData()
        };
        myPort.postMessage(generatePdfRequest, this.transferList);
      });
    } finally {
      await this.cleanupWorker();
    }
  }
  getPageCount() {
    return this.pageCount;
  }
}
exports.PdfMaker = PdfMaker;