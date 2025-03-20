"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enforceMaxByteSizeTransform = enforceMaxByteSizeTransform;
var _stream = require("stream");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function enforceMaxByteSizeTransform(maxByteSize) {
  let bytesSeen = 0;
  return new _stream.Transform({
    transform(chunk, _, cb) {
      if (!Buffer.isBuffer(chunk)) throw new Error(`Received a non-buffer chunk. All chunk must be buffers.`);
      bytesSeen += chunk.byteLength;
      if (bytesSeen > maxByteSize) {
        cb(new _errors.MaxByteSizeExceededError(maxByteSize));
      } else {
        cb(null, chunk);
      }
    }
  });
}