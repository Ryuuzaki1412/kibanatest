"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionListItemIds = exports.deleteFoundExceptionListItems = exports.deleteExceptionListItemByList = void 0;
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _std = require("@kbn/std");
var _find_exception_list_item_point_in_time_finder = require("./find_exception_list_item_point_in_time_finder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteExceptionListItemByList = async ({
  listId,
  savedObjectsClient,
  namespaceType
}) => {
  const ids = await getExceptionListItemIds({
    listId,
    namespaceType,
    savedObjectsClient
  });
  await deleteFoundExceptionListItems({
    ids,
    namespaceType,
    savedObjectsClient
  });
};
exports.deleteExceptionListItemByList = deleteExceptionListItemByList;
const getExceptionListItemIds = async ({
  listId,
  savedObjectsClient,
  namespaceType
}) => {
  // Stream the results from the Point In Time (PIT) finder into this array
  let ids = [];
  const executeFunctionOnStream = response => {
    const responseIds = response.data.map(exceptionListItem => exceptionListItem.id);
    ids = [...ids, ...responseIds];
  };
  await (0, _find_exception_list_item_point_in_time_finder.findExceptionListItemPointInTimeFinder)({
    executeFunctionOnStream,
    filter: undefined,
    listId,
    maxSize: undefined,
    // NOTE: This is unbounded when it is "undefined"
    namespaceType,
    perPage: 1_000,
    // See https://github.com/elastic/kibana/issues/93770 for choice of 1k
    savedObjectsClient,
    sortField: 'tie_breaker_id',
    sortOrder: 'desc'
  });
  return ids;
};

/**
 * NOTE: This is slow and terrible as we are deleting everything one at a time.
 * TODO: Replace this with a bulk call or a delete by query would be more useful
 */
exports.getExceptionListItemIds = getExceptionListItemIds;
const deleteFoundExceptionListItems = async ({
  ids,
  savedObjectsClient,
  namespaceType
}) => {
  const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectType)({
    namespaceType
  });
  await (0, _std.asyncForEach)(ids, async id => {
    try {
      await savedObjectsClient.delete(savedObjectType, id);
    } catch (err) {
      // This can happen from race conditions or networking issues so deleting the id's
      // like this is considered "best effort" and it is possible to get dangling pieces
      // of data sitting around in which case the user has to manually clean up the data
      // I am very hopeful this does not happen often or at all.
    }
  });
};
exports.deleteFoundExceptionListItems = deleteFoundExceptionListItems;