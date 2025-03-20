"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractPersistableStateReferences = extractPersistableStateReferences;
exports.extractPersistableStateReferencesFromSO = void 0;
exports.injectPersistableReferences = injectPersistableReferences;
exports.injectPersistableReferencesToSO = void 0;
var _attachments = require("../../common/utils/attachments");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function extractPersistableStateReferences(state, deps) {
  const {
    persistableStateAttachmentState,
    persistableStateAttachmentTypeId
  } = state;
  if (!deps.persistableStateAttachmentTypeRegistry.has(persistableStateAttachmentTypeId)) {
    return {
      state,
      references: []
    };
  }
  const attachment = deps.persistableStateAttachmentTypeRegistry.get(persistableStateAttachmentTypeId);
  const {
    state: extractedState,
    references: extractedReferences
  } = attachment.extract({
    persistableStateAttachmentState,
    persistableStateAttachmentTypeId
  });
  return {
    state: {
      ...state,
      ...extractedState,
      persistableStateAttachmentTypeId
    },
    references: extractedReferences
  };
}
function injectPersistableReferences({
  state,
  references = []
}, deps) {
  const {
    persistableStateAttachmentState,
    persistableStateAttachmentTypeId
  } = state;
  if (!deps.persistableStateAttachmentTypeRegistry.has(persistableStateAttachmentTypeId)) {
    return state;
  }
  const attachment = deps.persistableStateAttachmentTypeRegistry.get(persistableStateAttachmentTypeId);
  const injectedState = attachment.inject({
    persistableStateAttachmentState,
    persistableStateAttachmentTypeId
  }, references);
  return {
    ...state,
    ...injectedState,
    persistableStateAttachmentTypeId
  };
}
const extractPersistableStateReferencesFromSO = (attachmentAttributes, deps) => {
  let attributes = {
    ...attachmentAttributes
  };
  let references = [];
  if ((0, _attachments.isCommentRequestTypePersistableState)(attachmentAttributes)) {
    const {
      state,
      references: extractedReferences
    } = extractPersistableStateReferences(attachmentAttributes, deps);
    references = [...references, ...extractedReferences];
    attributes = {
      ...attributes,
      ...state
    };
  }
  return {
    attributes,
    references
  };
};
exports.extractPersistableStateReferencesFromSO = extractPersistableStateReferencesFromSO;
const injectPersistableReferencesToSO = (attachmentAttributes, references, deps) => {
  if ((0, _attachments.isCommentRequestTypePersistableState)(attachmentAttributes)) {
    const injectedState = injectPersistableReferences({
      state: attachmentAttributes,
      references
    }, deps);
    return {
      ...attachmentAttributes,
      ...injectedState
    };
  }
  return attachmentAttributes;
};
exports.injectPersistableReferencesToSO = injectPersistableReferencesToSO;