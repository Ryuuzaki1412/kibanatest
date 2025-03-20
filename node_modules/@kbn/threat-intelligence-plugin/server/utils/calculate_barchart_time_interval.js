"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateBarchartColumnTimeInterval = exports.BARCHART_NUMBER_OF_COLUMNS = void 0;
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BARCHART_NUMBER_OF_COLUMNS = 16;

/**
 * Calculates the time interval in ms for a specific number of columns
 * @param dateFrom Min (older) date for the barchart
 * @param dateTo Max (newer) date for the barchart
 * @param numberOfColumns Desired number of columns (defaulted to {@link BARCHART_NUMBER_OF_COLUMNS})
 * @returns The interval in ms for a column (for example '100000ms')
 */
exports.BARCHART_NUMBER_OF_COLUMNS = BARCHART_NUMBER_OF_COLUMNS;
const calculateBarchartColumnTimeInterval = (dateFrom, dateTo, numberOfColumns = BARCHART_NUMBER_OF_COLUMNS) => {
  const from = _moment.default.isMoment(dateFrom) ? dateFrom.valueOf() : dateFrom;
  const to = _moment.default.isMoment(dateTo) ? dateTo.valueOf() : dateTo;
  return `${Math.floor((0, _moment.default)(to).diff((0, _moment.default)(from)) / numberOfColumns)}ms`;
};
exports.calculateBarchartColumnTimeInterval = calculateBarchartColumnTimeInterval;