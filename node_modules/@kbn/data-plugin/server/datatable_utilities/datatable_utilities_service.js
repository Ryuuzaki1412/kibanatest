"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatatableUtilitiesService = void 0;
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class DatatableUtilitiesService {
  constructor(aggs, dataViews, fieldFormats, uiSettings) {
    this.aggs = aggs;
    this.dataViews = dataViews;
    this.fieldFormats = fieldFormats;
    this.uiSettings = uiSettings;
    this.asScopedToClient = this.asScopedToClient.bind(this);
  }
  async asScopedToClient(savedObjectsClient, elasticsearchClient) {
    const aggs = await this.aggs.asScopedToClient(savedObjectsClient, elasticsearchClient);
    const dataViews = await this.dataViews.dataViewsServiceFactory(savedObjectsClient, elasticsearchClient);
    const uiSettings = this.uiSettings.asScopedToClient(savedObjectsClient);
    const fieldFormats = await this.fieldFormats.fieldFormatServiceFactory(uiSettings);
    return new _common.DatatableUtilitiesService(aggs, dataViews, fieldFormats);
  }
}
exports.DatatableUtilitiesService = DatatableUtilitiesService;