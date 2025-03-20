"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFilter = void 0;
var _lodash = require("lodash");
var _range_filter = require("../build_filters/range_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const updateFilter = (filter, field, operator, params, fieldType) => {
  if (!field || !operator) {
    return updateField(filter, field);
  }
  if (operator.type === 'exists') {
    return updateWithExistsOperator(filter, operator);
  }
  if (operator.type === 'range') {
    return updateWithRangeOperator(filter, operator, params, field);
  }
  if (Array.isArray(params)) {
    return updateWithIsOneOfOperator(filter, operator, params);
  }
  return updateWithIsOperator(filter, operator, params, fieldType);
};
exports.updateFilter = updateFilter;
function updateField(filter, field) {
  return {
    ...filter,
    meta: {
      ...filter.meta,
      key: field,
      // @todo: check why we need to pass "key" and "field" with the same data
      field,
      params: {
        query: undefined
      },
      value: undefined,
      type: undefined
    },
    query: undefined
  };
}
function updateWithExistsOperator(filter, operator) {
  return {
    ...filter,
    meta: {
      ...filter.meta,
      negate: operator === null || operator === void 0 ? void 0 : operator.negate,
      type: operator === null || operator === void 0 ? void 0 : operator.type,
      params: undefined,
      value: 'exists'
    },
    query: {
      exists: {
        field: filter.meta.key
      }
    }
  };
}
function updateWithIsOperator(filter, operator, params, fieldType) {
  const safeParams = fieldType === 'number' && !params ? 0 : params;
  if (typeof filter.meta.params === 'object') {
    return {
      ...filter,
      meta: {
        ...filter.meta,
        negate: operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params: {
          ...filter.meta.params,
          query: params
        },
        value: undefined
      },
      query: {
        match_phrase: {
          [filter.meta.key]: safeParams !== null && safeParams !== void 0 ? safeParams : ''
        }
      }
    };
  } else {
    return {
      ...filter,
      meta: {
        ...filter.meta,
        negate: operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params: {
          query: params
        },
        value: undefined
      },
      query: {
        match_phrase: {
          [filter.meta.key]: safeParams !== null && safeParams !== void 0 ? safeParams : ''
        }
      }
    };
  }
}
function updateWithRangeOperator(filter, operator, rawParams, field) {
  if ((0, _range_filter.isRangeFilterParams)(rawParams)) {
    const {
      from,
      to
    } = rawParams;
    const params = {
      gte: from,
      lt: to
    };
    const updatedFilter = {
      ...filter,
      meta: {
        ...filter.meta,
        negate: operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params
      },
      query: {
        range: {
          [field]: params
        }
      }
    };
    return updatedFilter;
  } else {
    const from = (0, _lodash.get)(rawParams, 'from', undefined);
    const to = (0, _lodash.get)(rawParams, 'to', undefined);
    const params = {
      gte: from,
      lt: to
    };
    const updatedFilter = {
      ...filter,
      meta: {
        ...filter.meta,
        negate: operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params
      },
      query: {
        range: {
          [field]: params
        }
      }
    };
    return updatedFilter;
  }
}
function updateWithIsOneOfOperator(filter, operator, params) {
  if (Array.isArray(params)) {
    var _query;
    return {
      ...filter,
      meta: {
        ...filter.meta,
        negate: operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params
      },
      query: {
        bool: {
          minimum_should_match: 1,
          ...((_query = filter.query) === null || _query === void 0 ? void 0 : _query.should),
          should: params === null || params === void 0 ? void 0 : params.map(param => ({
            match_phrase: {
              [filter.meta.key]: param
            }
          }))
        }
      }
    };
  } else {
    return filter;
  }
}