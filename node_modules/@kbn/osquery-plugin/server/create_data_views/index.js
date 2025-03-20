"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDataViews = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createDataViews = async dataViewsService => {
  const dataView = (await dataViewsService.find('logs-osquery_manager.result*', 1))[0];
  if (!dataView) {
    await dataViewsService.createAndSave({
      title: 'logs-osquery_manager.result*',
      timeFieldName: '@timestamp',
      namespaces: ['*']
    });
  }
};
exports.createDataViews = createDataViews;