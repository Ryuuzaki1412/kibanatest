"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LENS_GAUGE_ID = exports.GROUP_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const LENS_GAUGE_ID = 'lnsGauge';
exports.LENS_GAUGE_ID = LENS_GAUGE_ID;
const GROUP_ID = {
  METRIC: 'metric',
  MIN: 'min',
  MAX: 'max',
  GOAL: 'goal'
};
exports.GROUP_ID = GROUP_ID;