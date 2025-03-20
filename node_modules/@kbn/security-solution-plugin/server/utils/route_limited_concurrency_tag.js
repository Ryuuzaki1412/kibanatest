"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routeLimitedConcurrencyTag = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Generates max concurrency tag, that can be passed to route tags
 * @param maxConcurrency - number max concurrency to add to tag
 * @returns string generetad route tag
 *
 */
const routeLimitedConcurrencyTag = maxConcurrency => [_constants.LIMITED_CONCURRENCY_ROUTE_TAG_PREFIX, maxConcurrency].join(':');
exports.routeLimitedConcurrencyTag = routeLimitedConcurrencyTag;