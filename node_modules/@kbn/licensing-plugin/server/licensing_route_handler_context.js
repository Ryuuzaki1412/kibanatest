"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRouteHandlerContext = createRouteHandlerContext;
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Create a route handler context for access to Kibana license information.
 * @param license$ An observable of a License instance.
 * @public
 */
function createRouteHandlerContext(license$, getStartServices) {
  return async function licensingRouteHandlerContext() {
    const [,, {
      featureUsage
    }] = await getStartServices();
    const license = await (0, _rxjs.firstValueFrom)(license$);
    return {
      featureUsage,
      license
    };
  };
}