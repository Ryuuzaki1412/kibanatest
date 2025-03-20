"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorStates = void 0;
var _constants = require("../../../../common/constants");
var _search = require("./search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// To simplify the handling of the group of pagination vars they're passed back to the client as a string
const jsonifyPagination = p => {
  if (!p) {
    return null;
  }
  return JSON.stringify(p);
};

// Gets a page of monitor states.
const getMonitorStates = async ({
  uptimeEsClient,
  dateRangeStart,
  dateRangeEnd,
  pagination,
  pageSize,
  filters,
  statusFilter,
  query
}) => {
  pagination = pagination || _constants.CONTEXT_DEFAULTS.CURSOR_PAGINATION;
  statusFilter = statusFilter === null ? undefined : statusFilter;
  const queryContext = new _search.QueryContext(uptimeEsClient, dateRangeStart, dateRangeEnd, pagination, filters && filters !== '' ? JSON.parse(filters) : null, pageSize, statusFilter, query);
  const size = Math.min(queryContext.size, _constants.QUERY.DEFAULT_AGGS_CAP);
  const iterator = new _search.MonitorSummaryIterator(queryContext);
  const page = await iterator.nextPage(size);
  return {
    summaries: page.monitorSummaries,
    nextPagePagination: jsonifyPagination(page.nextPagePagination),
    prevPagePagination: jsonifyPagination(page.prevPagePagination)
  };
};
exports.getMonitorStates = getMonitorStates;