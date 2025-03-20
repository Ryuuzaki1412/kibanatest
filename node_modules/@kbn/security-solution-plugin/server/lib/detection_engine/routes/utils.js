"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformBulkError = exports.isImportRegular = exports.isBulkError = exports.createBulkErrorObject = exports.convertToSnakeCase = exports.buildSiemResponse = exports.buildRouteValidation = exports.SiemResponseFactory = void 0;
var _fp = require("lodash/fp");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _custom_http_request_error = require("../../../utils/custom_http_request_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createBulkErrorObject = ({
  ruleId,
  id,
  statusCode,
  message
}) => {
  if (id != null && ruleId != null) {
    return {
      id,
      rule_id: ruleId,
      error: {
        status_code: statusCode,
        message
      }
    };
  } else if (id != null) {
    return {
      id,
      error: {
        status_code: statusCode,
        message
      }
    };
  } else if (ruleId != null) {
    return {
      rule_id: ruleId,
      error: {
        status_code: statusCode,
        message
      }
    };
  } else {
    return {
      rule_id: '(unknown id)',
      error: {
        status_code: statusCode,
        message
      }
    };
  }
};
exports.createBulkErrorObject = createBulkErrorObject;
const isBulkError = importRuleResponse => {
  return (0, _fp.has)('error', importRuleResponse);
};
exports.isBulkError = isBulkError;
const isImportRegular = importRuleResponse => {
  return !(0, _fp.has)('error', importRuleResponse) && (0, _fp.has)('status_code', importRuleResponse);
};
exports.isImportRegular = isImportRegular;
const transformBulkError = (ruleId, err) => {
  if (err instanceof _custom_http_request_error.CustomHttpRequestError) {
    var _err$statusCode;
    return createBulkErrorObject({
      ruleId,
      statusCode: (_err$statusCode = err.statusCode) !== null && _err$statusCode !== void 0 ? _err$statusCode : 400,
      message: err.message
    });
  } else if (err instanceof _securitysolutionEsUtils.BadRequestError) {
    return createBulkErrorObject({
      ruleId,
      statusCode: 400,
      message: err.message
    });
  } else {
    var _err$statusCode2;
    return createBulkErrorObject({
      ruleId,
      statusCode: (_err$statusCode2 = err.statusCode) !== null && _err$statusCode2 !== void 0 ? _err$statusCode2 : 500,
      message: err.message
    });
  }
};
exports.transformBulkError = transformBulkError;
const buildRouteValidation = schema => (payload, {
  ok,
  badRequest
}) => {
  const {
    value,
    error
  } = schema.validate(payload);
  if (error) {
    return badRequest(error.message);
  }
  return ok(value);
};
exports.buildRouteValidation = buildRouteValidation;
const statusToErrorMessage = statusCode => {
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 500:
      return 'Internal Error';
    default:
      return '(unknown error)';
  }
};
class SiemResponseFactory {
  constructor(response) {
    this.response = response;
  }
  error({
    statusCode,
    body,
    headers
  }) {
    const contentType = {
      'content-type': 'application/json'
    };
    const defaultedHeaders = {
      ...contentType,
      ...(headers !== null && headers !== void 0 ? headers : {})
    };
    return this.response.custom({
      headers: defaultedHeaders,
      statusCode,
      body: Buffer.from(JSON.stringify({
        message: body !== null && body !== void 0 ? body : statusToErrorMessage(statusCode),
        status_code: statusCode
      }))
    });
  }
}
exports.SiemResponseFactory = SiemResponseFactory;
const buildSiemResponse = response => new SiemResponseFactory(response);
exports.buildSiemResponse = buildSiemResponse;
const convertToSnakeCase = obj => {
  if (!obj) {
    return null;
  }
  return Object.keys(obj).reduce((acc, item) => {
    const newKey = (0, _fp.snakeCase)(item);
    return {
      ...acc,
      [newKey]: obj[item]
    };
  }, {});
};
exports.convertToSnakeCase = convertToSnakeCase;