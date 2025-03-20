"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMigratedDoc = void 0;
exports.createReference = createReference;
exports.migrateTimelineIdToReferences = void 0;
var _timelines = require("../timelines");
var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createReference(id, name, type) {
  return id != null ? [{
    id,
    name,
    type
  }] : [];
}
const migrateTimelineIdToReferences = doc => {
  const {
    timelineId,
    ...restAttributes
  } = doc.attributes;
  const {
    references: docReferences = []
  } = doc;
  const timelineIdReferences = createReference(timelineId, _constants.TIMELINE_ID_REF_NAME, _timelines.timelineSavedObjectType);
  return createMigratedDoc({
    doc,
    attributes: restAttributes,
    docReferences,
    migratedReferences: timelineIdReferences
  });
};
exports.migrateTimelineIdToReferences = migrateTimelineIdToReferences;
const createMigratedDoc = ({
  doc,
  attributes,
  docReferences,
  migratedReferences
}) => ({
  ...doc,
  attributes: {
    ...attributes
  },
  references: [...docReferences, ...migratedReferences]
});
exports.createMigratedDoc = createMigratedDoc;