"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelinesMigrations = exports.migrateSavedQueryIdToReferences = void 0;
var _constants = require("../../constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateSavedQueryIdToReferences = doc => {
  const {
    savedQueryId,
    ...restAttributes
  } = doc.attributes;
  const {
    references: docReferences = []
  } = doc;
  const savedQueryIdReferences = (0, _utils.createReference)(savedQueryId, _constants.SAVED_QUERY_ID_REF_NAME, _constants.SAVED_QUERY_TYPE);
  return (0, _utils.createMigratedDoc)({
    doc,
    attributes: restAttributes,
    docReferences,
    migratedReferences: savedQueryIdReferences
  });
};
exports.migrateSavedQueryIdToReferences = migrateSavedQueryIdToReferences;
const timelinesMigrations = {
  '7.16.0': migrateSavedQueryIdToReferences
};
exports.timelinesMigrations = timelinesMigrations;