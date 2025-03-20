"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectExceptionsReferences = void 0;
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This injects any "exceptionsList" "id"'s from saved object reference and returns the "exceptionsList" using the saved object reference. If for
 * some reason it is missing on saved object reference, we log an error about it and then take the last known good value from the "exceptionsList"
 *
 * @param logger The kibana injected logger
 * @param exceptionsList The exceptions list to merge the saved object reference from.
 * @param savedObjectReferences The saved object references which should contain an "exceptionsList"
 * @returns The exceptionsList with the saved object reference replacing any value in the saved object's id.
 */
const injectExceptionsReferences = ({
  logger,
  exceptionsList,
  savedObjectReferences
}) => {
  if (exceptionsList == null) {
    logger.error('Exception list is null when it never should be. This indicates potentially that saved object migrations did not run correctly. Returning empty exception list');
    return [];
  }
  return exceptionsList.map((exceptionItem, index) => {
    const savedObjectReference = (0, _utils.getSavedObjectReferenceForExceptionsList)({
      logger,
      index,
      savedObjectReferences
    });
    if (savedObjectReference != null) {
      const reference = {
        ...exceptionItem,
        id: savedObjectReference.id
      };
      return reference;
    } else {
      (0, _utils.logMissingSavedObjectError)({
        logger,
        missingFieldValue: exceptionItem,
        missingField: 'exception list'
      });
      return exceptionItem;
    }
  });
};
exports.injectExceptionsReferences = injectExceptionsReferences;