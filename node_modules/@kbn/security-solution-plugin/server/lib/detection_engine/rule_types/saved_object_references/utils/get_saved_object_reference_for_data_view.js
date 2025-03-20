"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedObjectReferenceForDataView = void 0;
var _get_saved_object_reference = require("./get_saved_object_reference");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given saved object references, this will return the data view saved object reference
 * even if it is mixed in with other reference objects. This is needed since a references array can contain multiple
 * types of saved objects in a single array
 * @param logger The kibana injected logger
 * @param savedObjectReferences The saved object references which can contain "dataViewId" mixed with other saved object types
 * @returns The saved object reference if found, otherwise undefined
 */
const getSavedObjectReferenceForDataView = ({
  logger,
  savedObjectReferences
}) => {
  return (0, _get_saved_object_reference.getSavedObjectReference)({
    logger,
    name: 'dataViewId',
    index: 0,
    savedObjectReferences
  });
};
exports.getSavedObjectReferenceForDataView = getSavedObjectReferenceForDataView;