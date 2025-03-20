"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modifyFilterKueryNode = exports.getModifiedValue = exports.getModifiedSearchFields = exports.getModifiedSearch = exports.getModifiedFilter = exports.getModifiedField = exports.getMappedParams = exports.MAPPED_PARAMS_PROPERTIES = void 0;
var _lodash = require("lodash");
var _validate_attributes = require("./validate_attributes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAPPED_PARAMS_PROPERTIES = ['risk_score', 'severity'];
exports.MAPPED_PARAMS_PROPERTIES = MAPPED_PARAMS_PROPERTIES;
const SEVERITY_MAP = {
  low: '20-low',
  medium: '40-medium',
  high: '60-high',
  critical: '80-critical'
};

/**
 * Returns the mapped_params object when given a params object.
 * The function will match params present in MAPPED_PARAMS_PROPERTIES and
 * return an empty object if nothing is matched.
 */
const getMappedParams = params => {
  return Object.entries(params).reduce((result, [key, value]) => {
    const snakeCaseKey = (0, _lodash.snakeCase)(key);
    if (MAPPED_PARAMS_PROPERTIES.includes(snakeCaseKey)) {
      result[snakeCaseKey] = getModifiedValue(snakeCaseKey, value);
    }
    return result;
  }, {});
};

/**
 * Returns a string of the filter, but with params replaced with mapped_params.
 * This function will check both camel and snake case to make sure we're consistent
 * with the naming
 *
 * i.e.: 'alerts.attributes.params.riskScore' -> 'alerts.attributes.mapped_params.risk_score'
 */
exports.getMappedParams = getMappedParams;
const getModifiedFilter = filter => {
  return filter.replace('.params.', '.mapped_params.');
};

/**
 * Returns modified field with mapped_params instead of params.
 *
 * i.e.: 'params.riskScore' -> 'mapped_params.risk_score'
 */
exports.getModifiedFilter = getModifiedFilter;
const getModifiedField = field => {
  if (!field) {
    return field;
  }
  const sortFieldToReplace = `${(0, _lodash.snakeCase)(field.replace('params.', ''))}`;
  if (MAPPED_PARAMS_PROPERTIES.includes(sortFieldToReplace)) {
    return `mapped_params.${sortFieldToReplace}`;
  }
  return field;
};

/**
 * Returns modified search fields with mapped_params instead of params.
 *
 * i.e.:
 * [
 *    'params.riskScore',
 *    'params.severity',
 * ]
 * ->
 * [
 *    'mapped_params.riskScore',
 *    'mapped_params.severity',
 * ]
 */
exports.getModifiedField = getModifiedField;
const getModifiedSearchFields = searchFields => {
  if (!searchFields) {
    return searchFields;
  }
  return searchFields.reduce((result, field) => {
    const modifiedField = getModifiedField(field);
    if (modifiedField) {
      return [...result, modifiedField];
    }
    return result;
  }, []);
};
exports.getModifiedSearchFields = getModifiedSearchFields;
const getModifiedValue = (key, value) => {
  if (key === 'severity') {
    return SEVERITY_MAP[value] || '';
  }
  return value;
};
exports.getModifiedValue = getModifiedValue;
const getModifiedSearch = (searchFields, value) => {
  if (!searchFields) {
    return value;
  }
  const fieldNames = Array.isArray(searchFields) ? searchFields : [searchFields];
  const modifiedSearchValues = fieldNames.map(fieldName => {
    const firstAttribute = (0, _validate_attributes.getFieldNameAttribute)(fieldName, ['alert', 'attributes', 'params', 'mapped_params']);
    return getModifiedValue(firstAttribute, value);
  });
  return modifiedSearchValues.find(search => search !== value) || value;
};
exports.getModifiedSearch = getModifiedSearch;
const modifyFilterKueryNode = ({
  astFilter,
  hasNestedKey = false,
  nestedKeys,
  storeValue,
  path = 'arguments'
}) => {
  const action = ({
    index,
    ast,
    fieldName,
    localFieldName
  }) => {
    // First index, assuming ast value is the attribute name
    if (index === 0) {
      const firstAttribute = (0, _validate_attributes.getFieldNameAttribute)(fieldName, ['alert', 'attributes']);
      // Replace the ast.value for params to mapped_params
      if (firstAttribute === 'params') {
        const attributeAfterParams = (0, _validate_attributes.getFieldNameAttribute)(fieldName, ['alert', 'attributes', 'params']);
        if (MAPPED_PARAMS_PROPERTIES.includes(attributeAfterParams)) {
          ast.value = getModifiedFilter(ast.value);
        }
      }
    }

    // Subsequent indices, assuming ast value is the filtering value
    else {
      const firstAttribute = (0, _validate_attributes.getFieldNameAttribute)(localFieldName, ['alert', 'attributes']);

      // Replace the ast.value for params value to the modified mapped_params value
      if (firstAttribute === 'params' && ast.value) {
        const attributeAfterParams = (0, _validate_attributes.getFieldNameAttribute)(localFieldName, ['alert', 'attributes', 'params']);
        if (MAPPED_PARAMS_PROPERTIES.includes(attributeAfterParams)) {
          ast.value = getModifiedValue(attributeAfterParams, ast.value);
        }
      }
    }
  };
  (0, _validate_attributes.iterateFilterKureyNode)({
    astFilter,
    hasNestedKey,
    nestedKeys,
    storeValue,
    path,
    action
  });
};
exports.modifyFilterKueryNode = modifyFilterKueryNode;