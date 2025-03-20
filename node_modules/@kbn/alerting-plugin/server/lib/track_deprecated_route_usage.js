"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackDeprecatedRouteUsage = trackDeprecatedRouteUsage;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function trackDeprecatedRouteUsage(route, usageCounter) {
  if (usageCounter) {
    usageCounter.incrementCounter({
      counterName: `deprecatedRoute_${route}`,
      counterType: 'deprecatedApiUsage',
      incrementBy: 1
    });
  }
}