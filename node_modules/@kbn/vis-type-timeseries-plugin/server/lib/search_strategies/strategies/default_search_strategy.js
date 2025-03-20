"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSearchStrategy = void 0;
var _abstract_search_strategy = require("./abstract_search_strategy");
var _default_search_capabilities = require("../capabilities/default_search_capabilities");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class DefaultSearchStrategy extends _abstract_search_strategy.AbstractSearchStrategy {
  async checkForViability(requestContext, req, indexPattern) {
    var _timeField$timeZone, _req$body$timerange, _timeField$fixedInter;
    const uiSettings = (await requestContext.core).uiSettings.client;
    const panel = req.body.panels ? req.body.panels[0] : undefined;
    const timeField = panel && indexPattern.indexPattern && indexPattern.indexPattern.getFieldByName(panel.time_field || indexPattern.indexPattern.timeFieldName);
    return {
      isViable: true,
      capabilities: new _default_search_capabilities.DefaultSearchCapabilities({
        panel,
        timezone: (timeField === null || timeField === void 0 ? void 0 : (_timeField$timeZone = timeField.timeZone) === null || _timeField$timeZone === void 0 ? void 0 : _timeField$timeZone[0]) || ((_req$body$timerange = req.body.timerange) === null || _req$body$timerange === void 0 ? void 0 : _req$body$timerange.timezone),
        forceFixedInterval: Boolean(timeField === null || timeField === void 0 ? void 0 : (_timeField$fixedInter = timeField.fixedInterval) === null || _timeField$fixedInter === void 0 ? void 0 : _timeField$fixedInter[0]),
        maxBucketsLimit: await uiSettings.get(_constants.UI_SETTINGS.MAX_BUCKETS_SETTING)
      })
    };
  }
  async getFieldsForWildcard(fetchedIndexPattern, indexPatternsService, capabilities) {
    return super.getFieldsForWildcard(fetchedIndexPattern, indexPatternsService, capabilities);
  }
}
exports.DefaultSearchStrategy = DefaultSearchStrategy;