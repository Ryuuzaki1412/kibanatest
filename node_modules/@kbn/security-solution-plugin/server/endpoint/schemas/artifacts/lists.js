"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrappedTranslatedExceptionList = exports.translatedPerformantEntries = exports.translatedExceptionListItem = exports.translatedEntryNestedEntry = exports.translatedEntryNested = exports.translatedEntryMatcher = exports.translatedEntryMatchWildcardNameMatcher = exports.translatedEntryMatchWildcardName = exports.translatedEntryMatchWildcardMatcher = exports.translatedEntryMatchWildcard = exports.translatedEntryMatchMatcher = exports.translatedEntryMatchAnyMatcher = exports.translatedEntryMatchAny = exports.translatedEntryMatch = exports.translatedEntry = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const translatedEntryMatchAnyMatcher = t.keyof({
  exact_cased_any: null,
  exact_caseless_any: null
});
exports.translatedEntryMatchAnyMatcher = translatedEntryMatchAnyMatcher;
const translatedEntryMatchAny = t.exact(t.type({
  field: t.string,
  operator: _securitysolutionIoTsListTypes.listOperator,
  type: translatedEntryMatchAnyMatcher,
  value: t.array(t.string)
}));
exports.translatedEntryMatchAny = translatedEntryMatchAny;
const translatedEntryMatchMatcher = t.keyof({
  exact_cased: null,
  exact_caseless: null
});
exports.translatedEntryMatchMatcher = translatedEntryMatchMatcher;
const translatedEntryMatchWildcardMatcher = t.keyof({
  wildcard_cased: null,
  wildcard_caseless: null
});
exports.translatedEntryMatchWildcardMatcher = translatedEntryMatchWildcardMatcher;
const translatedEntryMatchWildcard = t.exact(t.type({
  field: t.string,
  operator: _securitysolutionIoTsListTypes.listOperator,
  type: translatedEntryMatchWildcardMatcher,
  value: t.string
}));
exports.translatedEntryMatchWildcard = translatedEntryMatchWildcard;
const translatedEntryMatchWildcardNameMatcher = t.keyof({
  exact_cased: null,
  exact_caseless: null
});
exports.translatedEntryMatchWildcardNameMatcher = translatedEntryMatchWildcardNameMatcher;
const translatedEntryMatchWildcardName = t.exact(t.type({
  field: t.string,
  operator: _securitysolutionIoTsListTypes.listOperator,
  type: translatedEntryMatchWildcardNameMatcher,
  value: t.string
}));
exports.translatedEntryMatchWildcardName = translatedEntryMatchWildcardName;
const translatedEntryMatch = t.exact(t.type({
  field: t.string,
  operator: _securitysolutionIoTsListTypes.listOperator,
  type: translatedEntryMatchMatcher,
  value: t.string
}));
exports.translatedEntryMatch = translatedEntryMatch;
const translatedEntryMatcher = t.union([translatedEntryMatchMatcher, translatedEntryMatchAnyMatcher]);
exports.translatedEntryMatcher = translatedEntryMatcher;
const translatedEntryNestedEntry = t.union([translatedEntryMatch, translatedEntryMatchAny]);
exports.translatedEntryNestedEntry = translatedEntryNestedEntry;
const translatedEntryNested = t.exact(t.type({
  field: t.string,
  type: t.keyof({
    nested: null
  }),
  entries: t.array(translatedEntryNestedEntry)
}));
exports.translatedEntryNested = translatedEntryNested;
const translatedEntry = t.union([translatedEntryNested, translatedEntryMatch, translatedEntryMatchWildcard, translatedEntryMatchAny]);
exports.translatedEntry = translatedEntry;
const translatedPerformantEntries = t.array(t.union([translatedEntryMatchWildcard, translatedEntryMatchWildcardName]));
exports.translatedPerformantEntries = translatedPerformantEntries;
const translatedExceptionListItem = t.exact(t.type({
  type: t.string,
  entries: t.array(translatedEntry)
}));
exports.translatedExceptionListItem = translatedExceptionListItem;
const wrappedTranslatedExceptionList = t.exact(t.type({
  entries: t.array(translatedExceptionListItem)
}));
exports.wrappedTranslatedExceptionList = wrappedTranslatedExceptionList;