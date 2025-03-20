"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldMigrator = void 0;
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _lodash = _interopRequireDefault(require("lodash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This class handles remove fields from an object and moving them into the saved object reference fields. It also
 * handles going the opposite direction to add fields back into an object by setting them to null or if a reference is
 * found setting them to the value defined in the reference.
 *
 * This population of the field is to avoid having to change the UI to look in the references field of saved objects
 * to find these values.
 */
class FieldMigrator {
  constructor(fieldsToMigrate) {
    this.fieldsToMigrate = fieldsToMigrate;
  }
  extractFieldsToReferences({
    data,
    existingReferences = []
  }) {
    const copyOfData = _lodash.default.cloneDeep(data);
    const references = createReferenceMap(existingReferences);
    for (const field of this.fieldsToMigrate) {
      const fieldValue = _lodash.default.get(copyOfData, field.path);

      // the field is null, or if it is undefined and the path exists (undefined is the default return of _.get which is
      // why we need to distinguish if it is a valid path)
      if (fieldValue === null || fieldValue === undefined && _lodash.default.has(copyOfData, field.path)) {
        references.delete(field.name);
      } else if (fieldValue !== undefined) {
        references.set(field.name, {
          id: fieldValue,
          name: field.name,
          type: field.type
        });
      }

      // this will do nothing if the field wasn't present
      _lodash.default.unset(copyOfData, field.path);
    }
    return {
      transformedFields: copyOfData,
      references: Array.from(references.values())
    };
  }
  populateFieldsFromReferences(data) {
    const dataToManipulate = _lodash.default.cloneDeep(data);
    const references = createReferenceMap(data.references);
    for (const field of this.fieldsToMigrate) {
      const reference = references.get(field.name);
      if (reference) {
        (0, _saferLodashSet.set)(dataToManipulate.attributes, field.path, reference.id);
      } else {
        (0, _saferLodashSet.set)(dataToManipulate.attributes, field.path, null);
      }
    }
    return dataToManipulate;
  }
  populateFieldsFromReferencesForPatch({
    dataBeforeRequest,
    dataReturnedFromRequest
  }) {
    const dataToManipulate = _lodash.default.cloneDeep(dataReturnedFromRequest);
    const references = createReferenceMap(dataReturnedFromRequest.references);
    for (const field of this.fieldsToMigrate) {
      const reference = references.get(field.name);
      const fieldValueBeforeRequest = _lodash.default.get(dataBeforeRequest, field.path);
      if (fieldValueBeforeRequest !== undefined) {
        if (reference) {
          (0, _saferLodashSet.set)(dataToManipulate.attributes, field.path, reference.id);
        } else {
          // set path to fieldValueBeforeRequest
          (0, _saferLodashSet.set)(dataToManipulate.attributes, field.path, fieldValueBeforeRequest);
        }
      }
    }
    return dataToManipulate;
  }
}
exports.FieldMigrator = FieldMigrator;
function createReferenceMap(references = []) {
  return new Map(references.map(ref => [ref.name, ref]));
}