"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedObjectReference = void 0;
var _get_saved_object_name_pattern = require("./get_saved_object_name_pattern");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a saved object name, and an index, this will return the specific named saved object reference
 * even if it is mixed in with other reference objects. This is needed since a references array can contain multiple
 * types of saved objects in a single array, we have to use the name to get the value.
 * @param logger The kibana injected logger
 * @param name The name of the saved object reference we are getting from the array
 * @param index The index position to get for the exceptions list.
 * @param savedObjectReferences The saved object references which can contain "exceptionsList" mixed with other saved object types
 * @returns The saved object reference if found, otherwise undefined
 */
const getSavedObjectReference = ({
  logger,
  name,
  index,
  savedObjectReferences
}) => {
  if (!(index >= 0)) {
    throw new TypeError(`"index" should alway be >= 0 instead of: ${index}`);
  } else if (index > savedObjectReferences.length) {
    logger.error(['Cannot get a saved object reference using an index which is larger than the saved object references. Index is:', index, ' which is larger than the savedObjectReferences:', JSON.stringify(savedObjectReferences)].join(''));
  } else {
    return savedObjectReferences.find(reference => reference.name === (0, _get_saved_object_name_pattern.getSavedObjectNamePattern)({
      name,
      index
    }));
  }
};
exports.getSavedObjectReference = getSavedObjectReference;