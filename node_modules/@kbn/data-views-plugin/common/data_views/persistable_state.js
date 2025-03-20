"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewPersistableStateService = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const DataViewPersistableStateService = {
  inject: (state, references) => {
    return state;
  },
  extract: state => {
    return {
      state,
      references: []
    };
  },
  getAllMigrations: () => ({}),
  migrateToLatest: ({
    state
  }) => state,
  telemetry: () => ({})
};
exports.DataViewPersistableStateService = DataViewPersistableStateService;