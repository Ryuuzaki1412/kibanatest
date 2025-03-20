"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasUserDataView = exports.getDataViews = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getDataViews = async ({
  soClient
}) => soClient.find({
  type: 'index-pattern',
  fields: ['title'],
  search: `*`,
  searchFields: ['title'],
  perPage: 100
});

/**
 * Checks if user has access to any data view,
 * excluding those that are automatically created by ese (hardcoded)
 * @param esClient
 * @param soClient
 * @param dataViews
 */
exports.getDataViews = getDataViews;
const hasUserDataView = async ({
  esClient,
  soClient
}, dataViews) => {
  if (!dataViews) {
    dataViews = await getDataViews({
      esClient,
      soClient
    });
  }
  if (dataViews.total === 0) {
    return false;
  } else {
    // filter here data views that we know are not created by user during on-boarding for smoother on-boarding experience
    // currently there is no such data views,

    return true;
  }
};
exports.hasUserDataView = hasUserDataView;