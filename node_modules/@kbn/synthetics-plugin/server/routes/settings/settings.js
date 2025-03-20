"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexSizesRoute = void 0;
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIndexSizesRoute = () => ({
  method: 'GET',
  path: _constants.SYNTHETICS_API_URLS.INDEX_SIZE,
  validate: {},
  handler: async ({
    uptimeEsClient,
    server
  }) => {
    const data = await uptimeEsClient.baseESClient.cat.indices({
      index: 'synthetics-*',
      format: 'json',
      bytes: 'b'
    });
    return {
      data
    };
  }
});
exports.getIndexSizesRoute = getIndexSizesRoute;