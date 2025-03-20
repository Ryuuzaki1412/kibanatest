"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findValueListExceptionListItems = void 0;
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _escape_query = require("../utils/escape_query");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findValueListExceptionListItems = async ({
  valueListId,
  savedObjectsClient,
  page,
  pit,
  perPage,
  searchAfter,
  sortField,
  sortOrder
}) => {
  const escapedValueListId = (0, _escape_query.escapeQuotes)(valueListId);
  const savedObjectsFindResponse = await savedObjectsClient.find({
    filter: `(exception-list.attributes.list_type: item AND exception-list.attributes.entries.list.id:"${escapedValueListId}") OR (exception-list-agnostic.attributes.list_type: item AND exception-list-agnostic.attributes.entries.list.id:"${escapedValueListId}") `,
    page,
    perPage,
    pit,
    searchAfter,
    sortField,
    sortOrder,
    type: [_securitysolutionListUtils.exceptionListSavedObjectType, _securitysolutionListUtils.exceptionListAgnosticSavedObjectType]
  });
  return (0, _utils.transformSavedObjectsToFoundExceptionListItem)({
    savedObjectsFindResponse
  });
};
exports.findValueListExceptionListItems = findValueListExceptionListItems;