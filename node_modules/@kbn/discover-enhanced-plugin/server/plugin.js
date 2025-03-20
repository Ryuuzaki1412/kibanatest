"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiscoverEnhancedPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class DiscoverEnhancedPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "config$", void 0);
    this.context = context;
    this.config$ = context.config.create();
  }
  setup(core, {
    usageCollection
  }) {
    if (!!usageCollection) {
      const collector = usageCollection.makeUsageCollector({
        type: 'discoverEnhanced',
        schema: {
          exploreDataInChartActionEnabled: {
            type: 'boolean'
          }
        },
        isReady: () => true,
        fetch: async () => {
          const config = await (0, _rxjs.firstValueFrom)(this.config$);
          return {
            exploreDataInChartActionEnabled: config.actions.exploreDataInChart.enabled
          };
        }
      });
      usageCollection.registerCollector(collector);
    }
  }
  start(core) {}
}
exports.DiscoverEnhancedPlugin = DiscoverEnhancedPlugin;