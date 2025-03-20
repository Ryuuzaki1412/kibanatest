"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimestamp = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTimestamp = hit => {
  if (hit.fields && hit.fields['@timestamp']) {
    var _hit$fields$Timestam;
    return `${(_hit$fields$Timestam = hit.fields['@timestamp'][0]) !== null && _hit$fields$Timestam !== void 0 ? _hit$fields$Timestam : ''}`;
  }
  return '';
};
exports.getTimestamp = getTimestamp;