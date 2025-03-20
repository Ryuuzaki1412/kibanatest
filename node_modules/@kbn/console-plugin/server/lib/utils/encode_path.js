"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodePath = void 0;
var _url = require("url");
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const encodePath = path => {
  var _URLSearchParams$get;
  const decodedPath = (_URLSearchParams$get = new _url.URLSearchParams(`path=${path}`).get('path')) !== null && _URLSearchParams$get !== void 0 ? _URLSearchParams$get : '';
  // Take the initial path and compare it with the decoded path.
  // If the result is not the same, the path is encoded.
  const isEncoded = (0, _lodash.trimStart)(path, '/') !== (0, _lodash.trimStart)(decodedPath, '/');

  // Return the initial path if it is already encoded
  if (isEncoded) {
    return path;
  }

  // Encode every component except slashes
  return path.split('/').map(component => encodeURIComponent(component)).join('/');
};
exports.encodePath = encodePath;