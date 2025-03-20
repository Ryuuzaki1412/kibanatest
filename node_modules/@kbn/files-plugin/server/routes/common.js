"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDownloadHeadersForFile = getDownloadHeadersForFile;
exports.getDownloadedFileName = getDownloadedFileName;
var _mime = _interopRequireDefault(require("mime"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getDownloadHeadersForFile({
  file,
  fileName
}) {
  var _ref, _ref2;
  return {
    'content-type': (_ref = (_ref2 = fileName && _mime.default.getType(fileName)) !== null && _ref2 !== void 0 ? _ref2 : file.data.mimeType) !== null && _ref !== void 0 ? _ref : 'application/octet-stream',
    // Note, this name can be overridden by the client if set via a "download" attribute on the HTML tag.
    'content-disposition': `attachment; filename="${fileName || getDownloadedFileName(file)}"`,
    'cache-control': 'max-age=31536000, immutable',
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
    'x-content-type-options': 'nosniff'
  };
}
function getDownloadedFileName(file) {
  // When creating a file we also calculate the extension so the `file.extension`
  // check is not really necessary except for type checking.
  if (file.data.mimeType && file.data.extension) {
    return `${file.data.name}.${file.data.extension}`;
  }
  return file.data.name;
}