"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = exports.extract = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const inject = (state, references) => {
  const typedState = state;
  if ('attributes' in typedState && typedState.attributes !== undefined) {
    // match references based on name, so only references associated with this lens panel are injected.
    const matchedReferences = [];
    if (Array.isArray(typedState.attributes.references)) {
      typedState.attributes.references.forEach(serializableRef => {
        const internalReference = serializableRef;
        const matchedReference = references.find(reference => reference.name === internalReference.name);
        if (matchedReference) matchedReferences.push(matchedReference);
      });
    }
    typedState.attributes.references = matchedReferences;
  }
  return typedState;
};
exports.inject = inject;
const extract = state => {
  let references = [];
  const typedState = state;
  if ('attributes' in typedState && typedState.attributes !== undefined) {
    references = typedState.attributes.references;
  }
  return {
    state,
    references
  };
};
exports.extract = extract;