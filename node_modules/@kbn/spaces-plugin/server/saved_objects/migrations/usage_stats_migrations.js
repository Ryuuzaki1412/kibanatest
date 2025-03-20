"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateTo7141 = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateTo7141 = doc => {
  try {
    return resetFields(doc, [
    // Prior to this, we were counting the `overwrite` option incorrectly; reset all copy API counter fields so we get clean data
    'apiCalls.copySavedObjects.total', 'apiCalls.copySavedObjects.kibanaRequest.yes', 'apiCalls.copySavedObjects.kibanaRequest.no', 'apiCalls.copySavedObjects.createNewCopiesEnabled.yes', 'apiCalls.copySavedObjects.createNewCopiesEnabled.no', 'apiCalls.copySavedObjects.overwriteEnabled.yes', 'apiCalls.copySavedObjects.overwriteEnabled.no']);
  } catch (err) {
    // fail-safe
  }
  return doc;
};
exports.migrateTo7141 = migrateTo7141;
function resetFields(doc, fieldsToReset) {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  const {
    attributes = {}
  } = newDoc;
  for (const field of fieldsToReset) {
    attributes[field] = 0;
  }
  return {
    ...newDoc,
    attributes
  };
}