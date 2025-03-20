"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toURL = toURL;
var _url = require("url");
var _lodash = require("lodash");
var _encode_path = require("./encode_path");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function toURL(base, path) {
  const [pathname, query = ''] = path.split('?');

  // if there is a '+' sign in query e.g. ?q=create_date:[2020-05-10T08:00:00.000+08:00 TO *]
  // node url encodes it as a whitespace which results in a faulty request
  // we need to replace '+' with '%2b' to encode it correctly
  if (/\+/g.test(query)) {
    path = `${pathname}?${query.replace(/\+/g, '%2b')}`;
  }
  const urlResult = new _url.URL(`${(0, _lodash.trimEnd)(base, '/')}/${(0, _lodash.trimStart)(path, '/')}`);
  // Appending pretty here to have Elasticsearch do the JSON formatting, as doing
  // in JS can lead to data loss (7.0 will get munged into 7, thus losing indication of
  // measurement precision)
  if (!urlResult.searchParams.get('pretty')) {
    urlResult.searchParams.append('pretty', 'true');
  }

  // Node URL percent-encodes any invalid characters in url, which results in a bad request in some cases. E.g. urls with % character
  // To fix this, we set the pathname to the correctly encoded path here
  urlResult.pathname = (0, _encode_path.encodePath)(pathname);
  return urlResult;
}