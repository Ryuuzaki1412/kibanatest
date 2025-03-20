"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addConnectionCount = void 0;
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const addConnectionCount = async (tags, targetTypes, client) => {
  const ids = new Set(tags.map(tag => tag.id));
  const counts = new Map(tags.map(tag => [tag.id, 0]));
  const references = tags.map(({
    id
  }) => ({
    type: 'tag',
    id
  }));
  const pitFinder = client.createPointInTimeFinder({
    type: targetTypes,
    perPage: 1000,
    hasReference: references,
    hasReferenceOperator: 'OR'
  });
  const results = [];
  for await (const response of pitFinder.find()) {
    results.push(...response.saved_objects);
  }
  results.forEach(obj => {
    obj.references.forEach(ref => {
      if (ref.type === _constants.tagSavedObjectTypeName && ids.has(ref.id)) {
        counts.set(ref.id, counts.get(ref.id) + 1);
      }
    });
  });
  return tags.map(tag => ({
    ...tag,
    relationCount: counts.get(tag.id)
  }));
};
exports.addConnectionCount = addConnectionCount;