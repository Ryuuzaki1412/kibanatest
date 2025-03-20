"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateDataViewsPersistedState = migrateDataViewsPersistedState;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function migrateDataViewsPersistedState({
  attributes
}, migration) {
  let mapState = {
    adHocDataViews: []
  };
  if (attributes.mapStateJSON) {
    try {
      mapState = JSON.parse(attributes.mapStateJSON);
    } catch (e) {
      throw new Error('Unable to parse attribute mapStateJSON');
    }
    if (mapState.adHocDataViews && mapState.adHocDataViews.length > 0) {
      mapState.adHocDataViews = mapState.adHocDataViews.map(spec => {
        return migration(spec);
      });
    }
  }
  return {
    ...attributes,
    mapStateJSON: JSON.stringify(mapState)
  };
}