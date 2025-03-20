"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExceptionListItemPointInTimeFinder = void 0;
var _find_exception_list_items_point_in_time_finder = require("./find_exception_list_items_point_in_time_finder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Finds an exception list item within a point in time (PIT) and then calls the function
 * `executeFunctionOnStream` until the maxPerPage is reached and stops.
 * NOTE: This is slightly different from the saved objects version in that it takes
 * an injected function, so that we avoid doing additional plumbing with generators
 * to try to keep the maintenance of this machinery simpler for now.
 *
 * If you want to stream all results up to 10k into memory for correlation this would be:
 * @example
 * ```ts
 * const exceptionList: ExceptionListItemSchema[] = [];
 * const executeFunctionOnStream = (response: FoundExceptionListItemSchema) => {
 *   exceptionList = [...exceptionList, ...response.data];
 * }
 * await client.findExceptionListItemPointInTimeFinder({
 *   filter,
 *   executeFunctionOnStream,
 *   namespaceType,
 *   maxSize: 10_000, // NOTE: This is unbounded if it is "undefined"
 *   perPage: 1_000, // See https://github.com/elastic/kibana/issues/93770 for choice of 1k
 *   sortField,
 *   sortOrder,
 *   exe
 * });
 * ```
 * @param filter {string} Your filter
 * @param namespaceType {string} "agnostic" | "single" of your namespace
 * @param perPage {number} The number of items per page. Typical value should be 1_000 here. Never go above 10_000
 * @param maxSize {number of undefined} If given a max size, this will not exceeded. Otherwise if undefined is passed down, all records will be processed.
 * @param sortField {string} String of the field to sort against
 * @param savedObjectsClient {Object} The saved object client
 * @param sortOrder "asc" | "desc" The order to sort against
 */
const findExceptionListItemPointInTimeFinder = async ({
  executeFunctionOnStream,
  listId,
  namespaceType,
  savedObjectsClient,
  filter,
  maxSize,
  perPage,
  sortField,
  sortOrder
}) => {
  return (0, _find_exception_list_items_point_in_time_finder.findExceptionListsItemPointInTimeFinder)({
    executeFunctionOnStream,
    filter: filter != null ? [filter] : [],
    listId: [listId],
    maxSize,
    namespaceType: [namespaceType],
    perPage,
    savedObjectsClient,
    sortField,
    sortOrder
  });
};
exports.findExceptionListItemPointInTimeFinder = findExceptionListItemPointInTimeFinder;