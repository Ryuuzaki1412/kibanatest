"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalCount = exports.buildIndicatorShouldClauses = exports.buildIndicatorEnrichments = void 0;
var _lodash = require("lodash");
var _constants = require("../../../../../../common/cti/constants");
var _cti = require("../../../../../../common/search_strategy/security_solution/cti");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildIndicatorShouldClauses = eventFields => {
  return _cti.validEventFields.reduce((shoulds, eventField) => {
    const eventFieldValue = eventFields[eventField];
    if (!(0, _lodash.isEmpty)(eventFieldValue)) {
      shoulds.push({
        // @ts-expect-error unknown is not assignable to query
        match: {
          [_constants.EVENT_ENRICHMENT_INDICATOR_FIELD_MAP[eventField]]: {
            query: eventFieldValue,
            _name: eventField
          }
        }
      });
    }
    return shoulds;
  }, []);
};
exports.buildIndicatorShouldClauses = buildIndicatorShouldClauses;
const buildIndicatorEnrichments = hits => {
  return hits.flatMap(({
    matched_queries: matchedQueries,
    ...hit
  }) => {
    var _matchedQueries$reduc;
    return (_matchedQueries$reduc = matchedQueries === null || matchedQueries === void 0 ? void 0 : matchedQueries.reduce((enrichments, matchedQuery) => {
      if ((0, _cti.isValidEventField)(matchedQuery)) {
        enrichments.push({
          ...hit.fields,
          ...buildIndicatorMatchedFields(hit, matchedQuery)
        });
      }
      return enrichments;
    }, [])) !== null && _matchedQueries$reduc !== void 0 ? _matchedQueries$reduc : [];
  });
};
exports.buildIndicatorEnrichments = buildIndicatorEnrichments;
const buildIndicatorMatchedFields = (hit, eventField) => {
  const indicatorField = _constants.EVENT_ENRICHMENT_INDICATOR_FIELD_MAP[eventField];
  const atomic = (0, _lodash.get)(hit.fields, indicatorField);
  return {
    'matched.atomic': atomic,
    'matched.field': [eventField],
    'matched.id': [hit._id],
    'matched.index': [hit._index],
    'matched.type': [_constants.ENRICHMENT_TYPES.InvestigationTime]
  };
};
const getTotalCount = total => {
  if (total == null) {
    return 0;
  }
  if (typeof total === 'number') {
    return total;
  }
  return total.value;
};
exports.getTotalCount = getTotalCount;