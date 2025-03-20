"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamicActionFactoriesCollector = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const dynamicActionFactoriesCollector = (getActionFactory, state, stats) => {
  for (const event of state.events) {
    const factory = getActionFactory(event.action.factoryId);
    if (factory) {
      stats = factory.telemetry(event, stats);
    }
  }
  return stats;
};
exports.dynamicActionFactoriesCollector = dynamicActionFactoriesCollector;