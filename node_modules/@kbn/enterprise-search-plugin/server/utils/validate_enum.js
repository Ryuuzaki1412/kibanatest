"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEnum = validateEnum;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 *
 * @param enumToValidateAgainst enum to validate against
 * @param fieldName name of field, used for diagnostic messaging
 * @returns A validator usable in our API schema validator to validate that values adhere to the enum they're supposed to have
 */

function validateEnum(enumToValidateAgainst, fieldName) {
  return value => {
    if (!Object.values(enumToValidateAgainst).includes(value)) {
      return _i18n.i18n.translate('xpack.enterpriseSearch.server.utils.invalidEnumValue', {
        defaultMessage: 'Illegal value {value} for field {fieldName}',
        values: {
          fieldName,
          value
        }
      });
    }
  };
}