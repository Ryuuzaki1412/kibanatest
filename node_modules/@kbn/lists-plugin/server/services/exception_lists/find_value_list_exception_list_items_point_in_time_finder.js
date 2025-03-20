"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findValueListExceptionListItemsPointInTimeFinder = void 0;
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _escape_query = require("../utils/escape_query");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Finds value lists within exception lists within a point in time (PIT) and then calls the function
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
 * await client.findValueListExceptionListItemsPointInTimeFinder({
 *   valueListId,
 *   executeFunctionOnStream,
 *   namespaceType,
 *   maxSize: 10_000, // NOTE: This is unbounded if it is "undefined"
 *   perPage: 1_000, // See https://github.com/elastic/kibana/issues/93770 for choice of 1k
 *   sortField,
 *   sortOrder,
 *   exe
 * });
 * ```
 * @param valueListId {string} Your value list id
 * @param namespaceType {string} "agnostic" | "single" of your namespace
 * @param perPage {number} The number of items per page. Typical value should be 1_000 here. Never go above 10_000
 * @param maxSize {number of undefined} If given a max size, this will not exceeded. Otherwise if undefined is passed down, all records will be processed.
 * @param sortField {string} String of the field to sort against
 * @param savedObjectsClient {object} The saved objects client
 * @param sortOrder "asc" | "desc" The order to sort against
 */
const findValueListExceptionListItemsPointInTimeFinder = async ({
  valueListId,
  executeFunctionOnStream,
  savedObjectsClient,
  perPage,
  maxSize,
  sortField,
  sortOrder
}) => {
  const escapedValueListId = (0, _escape_query.escapeQuotes)(valueListId);
  const finder = savedObjectsClient.createPointInTimeFinder({
    filter: `(exception-list.attributes.list_type: item AND exception-list.attributes.entries.list.id:"${escapedValueListId}") OR (exception-list-agnostic.attributes.list_type: item AND exception-list-agnostic.attributes.entries.list.id:"${escapedValueListId}") `,
    perPage,
    sortField,
    sortOrder,
    type: [_securitysolutionListUtils.exceptionListSavedObjectType, _securitysolutionListUtils.exceptionListAgnosticSavedObjectType]
  });
  let count = 0;
  for await (const savedObjectsFindResponse of finder.find()) {
    count += savedObjectsFindResponse.saved_objects.length;
    const exceptionList = (0, _utils.transformSavedObjectsToFoundExceptionListItem)({
      savedObjectsFindResponse
    });
    if (maxSize != null && count > maxSize) {
      const diff = count - maxSize;
      exceptionList.data = exceptionList.data.slice(-exceptionList.data.length, -diff);
      executeFunctionOnStream(exceptionList);
      try {
        finder.close();
      } catch (exception) {
        // This is just a pre-caution in case the finder does a throw we don't want to blow up
        // the response. We have seen this within e2e test containers but nothing happen in normal
        // operational conditions which is why this try/catch is here.
      }
      // early return since we are at our maxSize
      return;
    }
    executeFunctionOnStream(exceptionList);
  }
  try {
    finder.close();
  } catch (exception) {
    // This is just a pre-caution in case the finder does a throw we don't want to blow up
    // the response. We have seen this within e2e test containers but nothing happen in normal
    // operational conditions which is why this try/catch is here.
  }
};
exports.findValueListExceptionListItemsPointInTimeFinder = findValueListExceptionListItemsPointInTimeFinder;