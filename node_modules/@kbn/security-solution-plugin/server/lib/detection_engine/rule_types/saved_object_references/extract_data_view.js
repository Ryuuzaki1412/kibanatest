"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractDataView = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This extracts the "dataViewId" and returns it as a saved object reference.
 * @param dataViewId The data view SO "id" to be returned as a saved object reference.
 * @returns The saved object references from the specified data view
 */
const extractDataView = ({
  dataViewId
}) => {
  if (dataViewId == null || dataViewId.trim() === '') {
    return [];
  } else {
    return [{
      name: 'dataViewId_0',
      id: dataViewId,
      type: 'index-pattern'
    }];
  }
};
exports.extractDataView = extractDataView;