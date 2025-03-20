"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAllListItems = void 0;
var _lists = require("../lists");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findAllListItems = async ({
  esClient,
  filter,
  listId,
  sortField,
  listIndex,
  listItemIndex,
  sortOrder
}) => {
  const list = await (0, _lists.getList)({
    esClient,
    id: listId,
    listIndex
  });
  if (list == null) {
    return null;
  } else {
    const allListItems = [];
    const query = (0, _utils.getQueryFilterWithListId)({
      filter,
      listId
    });
    const sort = (0, _utils.getSortWithTieBreaker)({
      sortField,
      sortOrder
    });
    const {
      count
    } = await esClient.count({
      body: {
        query
      },
      ignore_unavailable: true,
      index: listItemIndex
    });
    let response = await esClient.search({
      body: {
        query,
        sort
      },
      ignore_unavailable: true,
      index: listItemIndex,
      seq_no_primary_term: true,
      size: 10000
    });
    if (count > 100000) {
      throw new TypeError('API route only supports up to 100,000 items');
    }
    while (response.hits.hits.length !== 0) {
      allListItems.push(...(0, _utils.transformElasticToListItem)({
        response,
        type: list.type
      }));
      if (allListItems.length > 100000) {
        throw new TypeError('API route only supports up to 100,000 items');
      }
      response = await esClient.search({
        body: {
          query,
          search_after: response.hits.hits[response.hits.hits.length - 1].sort,
          sort
        },
        ignore_unavailable: true,
        index: listItemIndex,
        seq_no_primary_term: true,
        size: 10000
      });
    }
    return {
      data: allListItems,
      total: count
    };
  }
};
exports.findAllListItems = findAllListItems;