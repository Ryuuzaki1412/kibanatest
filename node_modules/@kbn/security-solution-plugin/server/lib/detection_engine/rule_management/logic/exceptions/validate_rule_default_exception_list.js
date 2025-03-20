"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRuleDefaultExceptionList = exports.ExceptionListError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _find_rules = require("../search/find_rules");
var _custom_http_request_error = require("../../../../../utils/custom_http_request_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ExceptionListError extends Error {
  constructor(message, statusCode) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.statusCode = statusCode;
  }
}

/**
 * Util to check if linked exceptions exist already the system
 * @param exceptionLists {array} - exception lists and items to import
 * @returns {Promise} exception lists or error if more than one default list found
 */
exports.ExceptionListError = ExceptionListError;
const validateRuleDefaultExceptionList = async ({
  exceptionsList,
  rulesClient,
  ruleRuleId,
  ruleId
}) => {
  var _rulesWithDefaultExce;
  if (!exceptionsList) {
    return;
  }
  const newDefaultExceptionsLists = exceptionsList.filter(list => list.type === _securitysolutionIoTsListTypes.ExceptionListTypeEnum.RULE_DEFAULT);
  if (newDefaultExceptionsLists.length === 0) return;
  if (newDefaultExceptionsLists.length > 1) {
    throw new _custom_http_request_error.CustomHttpRequestError('More than one default exception list found on rule', 400);
  }
  const newDefaultExceptionsList = newDefaultExceptionsLists[0];
  const rulesWithDefaultExceptionList = await (0, _find_rules.findRules)({
    rulesClient,
    filter: `alert.attributes.params.exceptionsList.list_id: "${newDefaultExceptionsList.list_id}"`,
    page: 1,
    fields: undefined,
    perPage: undefined,
    sortField: undefined,
    sortOrder: undefined
  });
  if (!rulesWithDefaultExceptionList || (rulesWithDefaultExceptionList === null || rulesWithDefaultExceptionList === void 0 ? void 0 : (_rulesWithDefaultExce = rulesWithDefaultExceptionList.data) === null || _rulesWithDefaultExce === void 0 ? void 0 : _rulesWithDefaultExce.length) === 0) return;
  const existingRuleId = ruleId || ruleRuleId;
  let isExceptionsExistInOtherRule = false;
  // exceptions exists in other rules
  if (!existingRuleId && rulesWithDefaultExceptionList.data.length > 0) {
    isExceptionsExistInOtherRule = true;
  }
  let isExceptionAttachToThisRule = false;
  // check if exceptions in this rule
  if (existingRuleId) {
    isExceptionAttachToThisRule = rulesWithDefaultExceptionList.data.some(rule => ruleId && ruleId === rule.id || ruleRuleId && ruleRuleId === rule.params.ruleId);
  }
  if (isExceptionsExistInOtherRule || !isExceptionAttachToThisRule) {
    const ids = rulesWithDefaultExceptionList.data.map(rule => rule.id);
    throw new _custom_http_request_error.CustomHttpRequestError(`default exception list${existingRuleId ? ` for rule: ${existingRuleId}` : ''} already exists ${ids ? `in rule(s): ${ids}` : ''}`, 409);
  }
};
exports.validateRuleDefaultExceptionList = validateRuleDefaultExceptionList;