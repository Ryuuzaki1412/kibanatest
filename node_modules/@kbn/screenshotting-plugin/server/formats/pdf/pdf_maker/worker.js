"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _worker_threads = require("worker_threads");
var _path = _interopRequireDefault(require("path"));
var _get_template = require("./get_template");
var _constants = require("./constants");
var _worker_dependencies = require("./worker_dependencies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

if (!_worker_threads.isMainThread) {
  const {
    port
  } = _worker_threads.workerData;
  port.on('message', execute);
}
const getPageCount = pdfDoc => {
  const pageRange = pdfDoc.bufferedPageRange();
  if (!pageRange) {
    return 0;
  }
  const {
    count,
    start
  } = pageRange;
  return start + count;
};
async function execute({
  data: {
    layout,
    logo,
    title,
    content
  }
}) {
  const {
    port
  } = _worker_threads.workerData;
  try {
    const tableBorderWidth = 1;
    const fontPath = filename => _path.default.resolve(_constants.assetPath, 'fonts', filename);
    const fonts = {
      Roboto: {
        normal: fontPath('roboto/Roboto-Regular.ttf'),
        bold: fontPath('roboto/Roboto-Medium.ttf'),
        italics: fontPath('roboto/Roboto-Italic.ttf'),
        bolditalics: fontPath('roboto/Roboto-Italic.ttf')
      },
      'noto-cjk': {
        // Roboto does not support CJK characters, so we'll fall back on this font if we detect them.
        normal: fontPath('noto/NotoSansCJKtc-Regular.ttf'),
        bold: fontPath('noto/NotoSansCJKtc-Medium.ttf'),
        italics: fontPath('noto/NotoSansCJKtc-Regular.ttf'),
        bolditalics: fontPath('noto/NotoSansCJKtc-Medium.ttf')
      }
    };
    const printer = new _worker_dependencies.Printer(fonts);
    const docDefinition = _worker_dependencies._.assign((0, _get_template.getTemplate)(layout, logo, title, tableBorderWidth, _constants.assetPath), {
      content: _worker_dependencies._.cloneDeepWith(content, value =>
      // The `pdfkit` library is using `Buffer.from(new Uint8Array(src))` construction to cast the image source.
      // According to the Node.js docs, it will create a copy of the source `ArrayBuffer` which should be avoided.
      // @see https://nodejs.org/api/buffer.html#static-method-bufferfrombuffer
      // @see https://github.com/foliojs-fork/pdfkit/blob/master/lib/image.js#L16
      value instanceof Uint8Array ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : undefined)
    });
    const pdfDoc = printer.createPdfKitDocument(docDefinition, {
      tableLayouts: {
        noBorder: {
          // format is function (i, node) { ... };
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0
        }
      }
    });
    if (!pdfDoc) {
      throw new Error('Document stream has not been generated');
    }
    const buffer = await new Promise((resolve, reject) => {
      const buffers = [];
      pdfDoc.on('error', reject);
      pdfDoc.on('data', data => {
        buffers.push(data);
      });
      pdfDoc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      pdfDoc.end();
    });
    const successResponse = {
      data: {
        buffer,
        metrics: {
          pages: getPageCount(pdfDoc)
        }
      }
    };
    port.postMessage(successResponse, [buffer.buffer /* Transfer buffer instead of copying */]);
  } catch (error) {
    const errorResponse = {
      error: error.message,
      data: null
    };
    port.postMessage(errorResponse);
  } finally {
    process.nextTick(() => {
      process.exit(0);
    });
  }
}