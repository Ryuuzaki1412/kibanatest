"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExceptionListsItem = void 0;
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _utils = require("./utils");
var _get_exception_list = require("./get_exception_list");
var _get_exception_lists_item_filter = require("./utils/get_exception_lists_item_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findExceptionListsItem = async ({
  listId,
  namespaceType,
  savedObjectsClient,
  filter,
  page,
  pit,
  perPage,
  search,
  searchAfter,
  sortField,
  sortOrder
}) => {
  const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectTypes)({
    namespaceType
  });
  const exceptionLists = (await Promise.all(listId.map((singleListId, index) => {
    return (0, _get_exception_list.getExceptionList)({
      id: undefined,
      listId: singleListId,
      namespaceType: namespaceType[index],
      savedObjectsClient
    });
  }))).filter(list => list != null);
  if (exceptionLists.length === 0) {
    return null;
  } else {
    const savedObjectsFindResponse = await savedObjectsClient.find({
      filter: (0, _get_exception_lists_item_filter.getExceptionListsItemFilter)({
        filter,
        listId,
        savedObjectType
      }),
      page,
      perPage,
      pit,
      search,
      searchAfter,
      sortField,
      sortOrder,
      type: savedObjectType
    });
    return (0, _utils.transformSavedObjectsToFoundExceptionListItem)({
      savedObjectsFindResponse
    });
  }
};
exports.findExceptionListsItem = findExceptionListsItem;