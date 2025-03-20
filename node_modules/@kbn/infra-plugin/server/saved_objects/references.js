"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectReferenceRT = exports.resolveSavedObjectReferences = exports.extractSavedObjectReferences = exports.SavedObjectReferenceResolutionError = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const savedObjectReferenceRT = rt.strict({
  name: rt.string,
  type: rt.string,
  id: rt.string
});

/**
 * Rewrites a saved object such that well-known saved object references
 * are extracted in the `references` array and replaced by the appropriate
 * name. This is the inverse operation to `resolveSavedObjectReferences`.
 */
exports.savedObjectReferenceRT = savedObjectReferenceRT;
const extractSavedObjectReferences = referenceExtractors => savedObjectAttributes => referenceExtractors.reduce(({
  attributes: accumulatedAttributes,
  references: accumulatedReferences
}, extract) => {
  const {
    attributes,
    references
  } = extract(accumulatedAttributes);
  return {
    attributes,
    references: [...accumulatedReferences, ...references]
  };
}, {
  attributes: savedObjectAttributes,
  references: []
});

/**
 * Rewrites a source configuration such that well-known saved object references
 * are resolved from the `references` argument and replaced by the real saved
 * object ids. This is the inverse operation to `extractSavedObjectReferences`.
 */
exports.extractSavedObjectReferences = extractSavedObjectReferences;
const resolveSavedObjectReferences = referenceResolvers => (attributes, references) => referenceResolvers.reduce((accumulatedAttributes, resolve) => resolve(accumulatedAttributes, references), attributes);
exports.resolveSavedObjectReferences = resolveSavedObjectReferences;
class SavedObjectReferenceResolutionError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'SavedObjectReferenceResolutionError';
  }
}
exports.SavedObjectReferenceResolutionError = SavedObjectReferenceResolutionError;