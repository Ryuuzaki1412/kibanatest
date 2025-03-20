"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autocompleteConfigDeprecationProvider = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const autocompleteConfigDeprecationProvider = ({
  renameFromRoot
}) => [renameFromRoot('data.autocomplete.valueSuggestions.terminateAfter', 'unifiedSearch.autocomplete.valueSuggestions.terminateAfter', {
  level: 'warning'
}), renameFromRoot('kibana.autocompleteTerminateAfter', 'unifiedSearch.autocomplete.valueSuggestions.terminateAfter', {
  level: 'warning'
}), renameFromRoot('data.autocomplete.valueSuggestions.timeout', 'unifiedSearch.autocomplete.valueSuggestions.timeout', {
  level: 'warning'
}), renameFromRoot('kibana.autocompleteTimeout', 'unifiedSearch.autocomplete.valueSuggestions.timeout', {
  level: 'warning'
}), renameFromRoot('data.autocomplete.querySuggestions.enabled', 'unifiedSearch.autocomplete.querySuggestions.enabled', {
  level: 'warning'
}), renameFromRoot('data.autocomplete.valueSuggestions.enabled', 'unifiedSearch.autocomplete.valueSuggestions.enabled', {
  level: 'warning'
}), renameFromRoot('data.autocomplete.valueSuggestions.tiers', 'unifiedSearch.autocomplete.valueSuggestions.tiers', {
  level: 'warning'
})];
exports.autocompleteConfigDeprecationProvider = autocompleteConfigDeprecationProvider;