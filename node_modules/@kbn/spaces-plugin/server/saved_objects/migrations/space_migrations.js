"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateTo660 = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateTo660 = doc => {
  if (!doc.attributes.hasOwnProperty('disabledFeatures')) {
    doc.attributes.disabledFeatures = [];
  }
  return doc;
};
exports.migrateTo660 = migrateTo660;