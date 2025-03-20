"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalHitsValue = exports.findListItem = void 0;
var _lists = require("../lists");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTotalHitsValue = totalHits => typeof totalHits === 'undefined' ? -1 : typeof totalHits === 'number' ? totalHits : totalHits.value;
exports.getTotalHitsValue = getTotalHitsValue;
const findListItem = async ({
  esClient,
  currentIndexPosition,
  filter,
  listId,
  page,
  perPage,
  searchAfter,
  sortField: sortFieldWithPossibleValue,
  listIndex,
  listItemIndex,
  sortOrder,
  runtimeMappings
}) => {
  const list = await (0, _lists.getList)({
    esClient,
    id: listId,
    listIndex
  });
  if (list == null) {
    return null;
  } else {
    const query = (0, _utils.getQueryFilterWithListId)({
      filter,
      listId
    });
    const sortField = sortFieldWithPossibleValue === 'value' ? list.type : sortFieldWithPossibleValue;
    const scroll = await (0, _utils.scrollToStartPage)({
      currentIndexPosition,
      esClient,
      filter,
      hopSize: 100,
      index: listItemIndex,
      page,
      perPage,
      runtimeMappings,
      searchAfter,
      sortField,
      sortOrder
    });
    const respose = await esClient.search({
      body: {
        query,
        runtime_mappings: runtimeMappings
      },
      ignore_unavailable: true,
      index: listItemIndex,
      size: 0,
      track_total_hits: true
    });
    if (scroll.validSearchAfterFound) {
      // Note: This typing of response = await esClient<SearchResponse<SearchEsListSchema>>
      // is because when you pass in seq_no_primary_term: true it does a "fall through" type and you have
      // to explicitly define the type <T>.
      const response = await esClient.search({
        body: {
          query,
          search_after: scroll.searchAfter,
          sort: (0, _utils.getSortWithTieBreaker)({
            sortField,
            sortOrder
          })
        },
        ignore_unavailable: true,
        index: listItemIndex,
        seq_no_primary_term: true,
        size: perPage
      });
      return {
        cursor: (0, _utils.encodeCursor)({
          page,
          perPage,
          searchAfter: (0, _utils.getSearchAfterWithTieBreaker)({
            response,
            sortField
          })
        }),
        data: (0, _utils.transformElasticToListItem)({
          response,
          type: list.type
        }),
        page,
        per_page: perPage,
        total: getTotalHitsValue(respose.hits.total)
      };
    } else {
      return {
        cursor: (0, _utils.encodeCursor)({
          page,
          perPage,
          searchAfter: undefined
        }),
        data: [],
        page,
        per_page: perPage,
        total: getTotalHitsValue(respose.hits.total)
      };
    }
  }
};
exports.findListItem = findListItem;