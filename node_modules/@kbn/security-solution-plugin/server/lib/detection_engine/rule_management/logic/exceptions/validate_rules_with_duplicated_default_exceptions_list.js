"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRulesWithDuplicatedDefaultExceptionsList = void 0;
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _custom_http_request_error = require("../../../../../utils/custom_http_request_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Check if rule has duplicated default exceptions lits
 */
const validateRulesWithDuplicatedDefaultExceptionsList = ({
  exceptionsList,
  allRules,
  ruleId
}) => {
  var _exceptionsList$filte, _exceptionsList$filte2;
  if (!exceptionsList) return;
  const defaultExceptionToTuRulesMap = {};
  allRules.forEach((rule, ruleIndex) => {
    var _rule$exceptions_list;
    (_rule$exceptions_list = rule.exceptions_list) === null || _rule$exceptions_list === void 0 ? void 0 : _rule$exceptions_list.forEach(list => {
      if (list.type === _securitysolutionIoTsListTypes.ExceptionListTypeEnum.RULE_DEFAULT) {
        defaultExceptionToTuRulesMap[list.id] ??= [];
        defaultExceptionToTuRulesMap[list.id].push(ruleIndex);
      }
    });
  });
  const duplicatedExceptionsList = (_exceptionsList$filte = exceptionsList === null || exceptionsList === void 0 ? void 0 : (_exceptionsList$filte2 = exceptionsList.filter(list => list.type === _securitysolutionIoTsListTypes.ExceptionListTypeEnum.RULE_DEFAULT)) === null || _exceptionsList$filte2 === void 0 ? void 0 : _exceptionsList$filte2.filter(list => {
    var _defaultExceptionToTu;
    return ((_defaultExceptionToTu = defaultExceptionToTuRulesMap[list.id]) === null || _defaultExceptionToTu === void 0 ? void 0 : _defaultExceptionToTu.length) > 1;
  })) !== null && _exceptionsList$filte !== void 0 ? _exceptionsList$filte : [];
  if (duplicatedExceptionsList.length > 0) {
    const ids = duplicatedExceptionsList === null || duplicatedExceptionsList === void 0 ? void 0 : duplicatedExceptionsList.map(list => list.id).join(', ');
    throw new _custom_http_request_error.CustomHttpRequestError(`default exceptions list ${ids}${ruleId ? ` for rule ${ruleId}` : ''} is duplicated`, 409);
  }
};
exports.validateRulesWithDuplicatedDefaultExceptionsList = validateRulesWithDuplicatedDefaultExceptionsList;