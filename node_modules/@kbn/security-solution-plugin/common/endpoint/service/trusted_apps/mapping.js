"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagsToEffectScope = void 0;
var _constants = require("../artifacts/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Looks at an array of `tags` (attributed defined on the `ExceptionListItemSchema`) and returns back
 * the `EffectScope` of based on the data in the array
 * @param tags
 */
const tagsToEffectScope = tags => {
  const policyReferenceTags = tags.filter(tag => tag.startsWith(_constants.BY_POLICY_ARTIFACT_TAG_PREFIX));
  if (policyReferenceTags.some(tag => tag === `${_constants.BY_POLICY_ARTIFACT_TAG_PREFIX}all`)) {
    return {
      type: 'global'
    };
  } else {
    return {
      type: 'policy',
      policies: policyReferenceTags.map(tag => tag.substr(_constants.BY_POLICY_ARTIFACT_TAG_PREFIX.length))
    };
  }
};
exports.tagsToEffectScope = tagsToEffectScope;