"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateDataPersistedState = migrateDataPersistedState;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function migrateDataPersistedState({
  attributes
}, filterMigration) {
  let mapState = {
    filters: []
  };
  if (attributes.mapStateJSON) {
    try {
      mapState = JSON.parse(attributes.mapStateJSON);
    } catch (e) {
      throw new Error('Unable to parse attribute mapStateJSON');
    }
    mapState.filters = filterMigration(mapState.filters);
  }
  return {
    ...attributes,
    mapStateJSON: JSON.stringify(mapState)
  };
}