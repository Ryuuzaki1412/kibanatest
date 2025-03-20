"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGenericData = void 0;
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getGenericData = (data, keyBucket) => {
  let result = [];
  data.forEach(bucketData => {
    var _get;
    // if key_as_string is present use it, else default to the existing key
    const group = (_get = (0, _fp.get)('key_as_string', bucketData)) !== null && _get !== void 0 ? _get : (0, _fp.get)('key', bucketData);
    const histData = (0, _fp.getOr)([], keyBucket, bucketData).map(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ({
      key,
      doc_count
    }) => ({
      x: key,
      y: doc_count,
      g: group
    }));
    result = [...result, ...histData];
  });
  return result;
};
exports.getGenericData = getGenericData;