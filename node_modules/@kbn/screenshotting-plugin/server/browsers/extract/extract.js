"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = extract;
var _path = _interopRequireDefault(require("path"));
var _unzip = require("./unzip");
var _extract_error = require("./extract_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function extract(archivePath, targetPath) {
  const fileType = _path.default.parse(archivePath).ext.substr(1);
  let unpacker;
  switch (fileType) {
    case 'zip':
      unpacker = _unzip.unzip;
      break;
    default:
      throw new _extract_error.ExtractError(new Error(`Unable to unpack filetype: ${fileType}`));
  }
  await unpacker(archivePath, targetPath);
}