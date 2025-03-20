"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isScriptedPhraseFilter = exports.isPhraseFilter = exports.getPhraseScript = exports.getPhraseFilterValue = exports.getPhraseFilterField = exports.buildPhraseFilter = exports.buildInlineScriptForPhraseFilter = void 0;
var _lodash = require("lodash");
var _get_converted_value_for_field = require("./get_converted_value_for_field");
var _range_filter = require("./range_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @param filter
 * @returns `true` if a filter is a `PhraseFilter`
 *
 * @public
 */
const isPhraseFilter = filter => {
  const isMatchPhraseQuery = (0, _lodash.has)(filter, 'query.match_phrase');
  const matchQueryPart = (0, _lodash.get)(filter, 'query.match', []);
  const isDeprecatedMatchPhraseQuery = Object.values(matchQueryPart).find(params => params.type === 'phrase') !== undefined;
  return isMatchPhraseQuery || isDeprecatedMatchPhraseQuery;
};

/**
 * @param filter
 * @returns `true` if a filter is a scripted `PhrasesFilter`
 *
 * @public
 */
exports.isPhraseFilter = isPhraseFilter;
const isScriptedPhraseFilter = filter => {
  var _filter$query, _filter$query$script, _filter$query$script$;
  return (0, _lodash.has)(filter, 'query.script.script.params.value') && !(0, _range_filter.hasRangeKeys)((_filter$query = filter.query) === null || _filter$query === void 0 ? void 0 : (_filter$query$script = _filter$query.script) === null || _filter$query$script === void 0 ? void 0 : (_filter$query$script$ = _filter$query$script.script) === null || _filter$query$script$ === void 0 ? void 0 : _filter$query$script$.params);
};

/** @internal */
exports.isScriptedPhraseFilter = isScriptedPhraseFilter;
const getPhraseFilterField = filter => {
  var _filter$meta, _ref, _filter$query$match_p;
  if ((_filter$meta = filter.meta) !== null && _filter$meta !== void 0 && _filter$meta.field) return filter.meta.field;
  const queryConfig = (_ref = (_filter$query$match_p = filter.query.match_phrase) !== null && _filter$query$match_p !== void 0 ? _filter$query$match_p : filter.query.match) !== null && _ref !== void 0 ? _ref : {};
  return Object.keys(queryConfig)[0];
};

/**
 * @internal
 */
exports.getPhraseFilterField = getPhraseFilterField;
const getPhraseFilterValue = filter => {
  if (isPhraseFilter(filter)) {
    const queryConfig = filter.query.match_phrase || filter.query.match || {};
    const queryValue = Object.values(queryConfig)[0];
    return (0, _lodash.isPlainObject)(queryValue) ? queryValue.query : queryValue;
  } else {
    var _filter$query2, _filter$query2$script, _filter$query2$script2, _filter$query2$script3;
    return (_filter$query2 = filter.query) === null || _filter$query2 === void 0 ? void 0 : (_filter$query2$script = _filter$query2.script) === null || _filter$query2$script === void 0 ? void 0 : (_filter$query2$script2 = _filter$query2$script.script) === null || _filter$query2$script2 === void 0 ? void 0 : (_filter$query2$script3 = _filter$query2$script2.params) === null || _filter$query2$script3 === void 0 ? void 0 : _filter$query2$script3.value;
  }
};

/**
 * Creates a filter where the given field matches a given value
 * @param field
 * @param params
 * @param indexPattern
 * @returns `PhraseFilter`
 *
 * @public
 */
exports.getPhraseFilterValue = getPhraseFilterValue;
const buildPhraseFilter = (field, value, indexPattern) => {
  const convertedValue = (0, _get_converted_value_for_field.getConvertedValueForField)(field, value);
  if (field.scripted) {
    return {
      meta: {
        index: indexPattern.id,
        field: field.name
      },
      query: {
        script: getPhraseScript(field, value)
      }
    };
  } else {
    return {
      meta: {
        index: indexPattern.id
      },
      query: {
        match_phrase: {
          [field.name]: convertedValue
        }
      }
    };
  }
};

/** @internal */
exports.buildPhraseFilter = buildPhraseFilter;
const getPhraseScript = (field, value) => {
  const convertedValue = (0, _get_converted_value_for_field.getConvertedValueForField)(field, value);
  const script = buildInlineScriptForPhraseFilter(field);
  return {
    script: {
      source: script,
      lang: field.lang,
      params: {
        value: convertedValue
      }
    }
  };
};

/**
 * @internal
 * Takes a scripted field and returns an inline script appropriate for use in a script query.
 * Handles lucene expression and Painless scripts. Other langs aren't guaranteed to generate valid
 * scripts.
 *
 * @param {object} scriptedField A Field object representing a scripted field
 * @returns {string} The inline script string
 */
exports.getPhraseScript = getPhraseScript;
const buildInlineScriptForPhraseFilter = scriptedField => {
  // We must wrap painless scripts in a lambda in case they're more than a simple expression
  if (scriptedField.lang === 'painless') {
    return `boolean compare(Supplier s, def v) {if(s.get() instanceof List){List list = s.get(); for(def k : list){if(k==v){return true;}}return false;}else{return s.get() == v;}}` + `compare(() -> { ${scriptedField.script} }, params.value);`;
  } else {
    return `(${scriptedField.script}) == value`;
  }
};
exports.buildInlineScriptForPhraseFilter = buildInlineScriptForPhraseFilter;