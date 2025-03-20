"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "fileObjectType", {
  enumerable: true,
  get: function () {
    return _file.fileObjectType;
  }
});
Object.defineProperty(exports, "fileShareObjectType", {
  enumerable: true,
  get: function () {
    return _file_share.fileShareObjectType;
  }
});
exports.hiddenTypes = void 0;
var _file = require("./file");
var _file_share = require("./file_share");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const hiddenTypes = [_file.fileObjectType.name, _file_share.fileShareObjectType.name];
exports.hiddenTypes = hiddenTypes;