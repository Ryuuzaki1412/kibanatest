"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertsFieldMap840 = void 0;
var _ = require("../8.0.0");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const alertsFieldMap840 = {
  ..._.alertsFieldMap,
  'kibana.alert.new_terms': {
    type: 'keyword',
    array: true,
    required: false
  }
};
exports.alertsFieldMap840 = alertsFieldMap840;