"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CurrencyFormat = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _numeral = require("./numeral");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public */
class CurrencyFormat extends _numeral.NumeralFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "id", CurrencyFormat.id);
    (0, _defineProperty2.default)(this, "title", CurrencyFormat.title);
    (0, _defineProperty2.default)(this, "allowsNumericalAggregations", true);
  }
}
exports.CurrencyFormat = CurrencyFormat;
(0, _defineProperty2.default)(CurrencyFormat, "id", _types.FIELD_FORMAT_IDS.CURRENCY);
(0, _defineProperty2.default)(CurrencyFormat, "title", _i18n.i18n.translate('fieldFormats.currency.title', {
  defaultMessage: 'Currency'
}));