"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultAsyncGetParams = getDefaultAsyncGetParams;
exports.getDefaultAsyncSubmitParams = getDefaultAsyncSubmitParams;
var _async_utils = require("../common/async_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 @internal
 */
function getDefaultAsyncSubmitParams(searchConfig, options) {
  return {
    ...(0, _async_utils.getCommonDefaultAsyncSubmitParams)(searchConfig, options, {
      /**
       * force disable search sessions until sessions support SQL
       * https://github.com/elastic/kibana/issues/127880
       */
      disableSearchSessions: true
    })
  };
}

/**
 @internal
 */
function getDefaultAsyncGetParams(searchConfig, options) {
  return {
    ...(0, _async_utils.getCommonDefaultAsyncGetParams)(searchConfig, options, {
      /**
       * force disable search sessions until sessions support SQL
       * https://github.com/elastic/kibana/issues/127880
       */
      disableSearchSessions: true
    })
  };
}