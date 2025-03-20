"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitialMlJobUsage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Default ml job usage count
 */
const getInitialMlJobUsage = () => ({
  custom: {
    enabled: 0,
    disabled: 0
  },
  elastic: {
    enabled: 0,
    disabled: 0
  }
});
exports.getInitialMlJobUsage = getInitialMlJobUsage;