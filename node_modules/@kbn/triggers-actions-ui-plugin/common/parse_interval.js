"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseInterval = exports.INTERVAL_STRING_RE = void 0;
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INTERVAL_STRING_RE = new RegExp(`^([\\d\\.]+)\\s*(${_datemath.default.units.join('|')})$`);
exports.INTERVAL_STRING_RE = INTERVAL_STRING_RE;
const parseInterval = intervalString => {
  if (intervalString) {
    const matches = intervalString.match(INTERVAL_STRING_RE);
    if (matches) {
      const value = Number(matches[1]);
      const unit = matches[2];
      return {
        value,
        unit
      };
    }
  }
  throw new Error(_i18n.i18n.translate('xpack.triggersActionsUI.parseInterval.errorMessage', {
    defaultMessage: '{value} is not an interval string',
    values: {
      value: intervalString
    }
  }));
};
exports.parseInterval = parseInterval;