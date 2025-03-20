"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExceptionList = void 0;
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _utils = require("./utils");
var _get_exception_list_filter = require("./utils/get_exception_list_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findExceptionList = async ({
  namespaceType,
  savedObjectsClient,
  filter,
  page,
  perPage,
  searchAfter,
  sortField,
  sortOrder,
  pit
}) => {
  const savedObjectTypes = (0, _securitysolutionListUtils.getSavedObjectTypes)({
    namespaceType
  });
  const savedObjectsFindResponse = await savedObjectsClient.find({
    filter: (0, _get_exception_list_filter.getExceptionListFilter)({
      filter,
      savedObjectTypes
    }),
    page,
    perPage,
    pit,
    searchAfter,
    sortField,
    sortOrder,
    type: savedObjectTypes
  });
  return (0, _utils.transformSavedObjectsToFoundExceptionList)({
    savedObjectsFindResponse
  });
};
exports.findExceptionList = findExceptionList;