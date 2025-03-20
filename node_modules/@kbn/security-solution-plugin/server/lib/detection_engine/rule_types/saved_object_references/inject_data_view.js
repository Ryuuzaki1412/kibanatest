"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectDataViewReferences = void 0;
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This injects any "dataViewId" from saved object reference and returns the "dataViewId" using the saved object reference. If for
 * some reason it is missing on saved object reference, we log an error about it and then take the last known good value from the "dataViewId"
 *
 * @param logger The kibana injected logger
 * @param dataViewId The data view id to merge the saved object reference from.
 * @param savedObjectReferences The saved object references which should contain an "dataViewId"
 * @returns The dataViewId with the saved object reference replacing any value in the saved object's id.
 */
const injectDataViewReferences = ({
  logger,
  savedObjectReferences
}) => {
  const foundSavedObject = (0, _utils.getSavedObjectReferenceForDataView)({
    logger,
    savedObjectReferences
  });
  if (foundSavedObject != null) {
    const reference = foundSavedObject.id;
    return reference;
  } else {
    return undefined;
  }
};
exports.injectDataViewReferences = injectDataViewReferences;