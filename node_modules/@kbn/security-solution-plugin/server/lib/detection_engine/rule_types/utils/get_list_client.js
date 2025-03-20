"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListClient = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getListClient = ({
  lists,
  spaceId,
  updatedByUser,
  esClient,
  savedObjectClient
}) => {
  if (lists == null) {
    throw new Error('lists plugin unavailable during rule execution');
  }
  const listClient = lists.getListClient(esClient, spaceId, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  const exceptionsClient = lists.getExceptionListClient(savedObjectClient, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  return {
    listClient,
    exceptionsClient
  };
};
exports.getListClient = getListClient;