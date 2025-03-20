"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewInsufficientAccessError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Error thrown when action attempted without sufficient access.
 * @constructor
 * @param {string} message - Saved object id of data view for display in error message
 */
class DataViewInsufficientAccessError extends Error {
  /**
   * constructor
   * @param {string} message - Saved object id of data view for display in error message
   */
  constructor(savedObjectId) {
    super(`Operation failed due to insufficient access, id: ${savedObjectId}`);
    this.name = 'DataViewInsufficientAccessError';
  }
}
exports.DataViewInsufficientAccessError = DataViewInsufficientAccessError;