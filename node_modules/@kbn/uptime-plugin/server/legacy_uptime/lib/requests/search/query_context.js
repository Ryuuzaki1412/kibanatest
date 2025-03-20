"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryContext = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _moment = _interopRequireDefault(require("moment"));
var _runtime_types = require("../../../../../common/runtime_types");
var _get_histogram_interval = require("../../../../../common/lib/get_histogram_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class QueryContext {
  constructor(database, dateRangeStart, dateRangeEnd, pagination, filterClause, size, statusFilter, query) {
    (0, _defineProperty2.default)(this, "callES", void 0);
    (0, _defineProperty2.default)(this, "dateRangeStart", void 0);
    (0, _defineProperty2.default)(this, "dateRangeEnd", void 0);
    (0, _defineProperty2.default)(this, "pagination", void 0);
    (0, _defineProperty2.default)(this, "filterClause", void 0);
    (0, _defineProperty2.default)(this, "size", void 0);
    (0, _defineProperty2.default)(this, "statusFilter", void 0);
    (0, _defineProperty2.default)(this, "hasTimespanCache", void 0);
    (0, _defineProperty2.default)(this, "query", void 0);
    this.callES = database;
    this.dateRangeStart = dateRangeStart;
    this.dateRangeEnd = dateRangeEnd;
    this.pagination = pagination;
    this.filterClause = filterClause;
    this.size = size;
    this.statusFilter = statusFilter;
    this.query = query;
  }
  async search(params, operationName) {
    return this.callES.search(params, operationName);
  }
  async count(params) {
    const {
      result: {
        body
      }
    } = await this.callES.count(params);
    return body;
  }
  async dateAndCustomFilters() {
    const clauses = [await this.dateRangeFilter()];
    if (this.filterClause) {
      clauses.push(this.filterClause);
    }
    return clauses;
  }
  async dateRangeFilter() {
    const timestampClause = {
      range: {
        '@timestamp': {
          gte: this.dateRangeStart,
          lte: this.dateRangeEnd
        }
      }
    };
    if (!(await this.hasTimespan())) {
      return timestampClause;
    }
    return {
      bool: {
        filter: [timestampClause, {
          bool: {
            should: [this.timespanClause(), {
              bool: {
                must_not: {
                  exists: {
                    field: 'monitor.timespan'
                  }
                }
              }
            }]
          }
        }]
      }
    };
  }

  // timeRangeClause queries the given date range using the monitor timespan field
  // which is a bit dicey since we may have data that predates this field existing,
  // or we may have data that has it, but a slow ingestion process.
  timespanClause() {
    // We subtract 20m from the start to account for data that shows up late,
    // for instance, with a large value for the elasticsearch refresh interval
    // setting it lower can work very well on someone's laptop, but with real world
    // latencies and slowdowns that's dangerous. Making this value larger makes things
    // only slower, but only marginally so, and prevents people from seeing weird
    // behavior.

    if (this.dateRangeEnd === 'now') {
      return {
        range: {
          'monitor.timespan': {
            gte: 'now-20m',
            lte: 'now'
          }
        }
      };
    }
    const tsEnd = (0, _get_histogram_interval.parseRelativeDate)(this.dateRangeEnd, {
      roundUp: true
    });
    const tsStart = (0, _moment.default)(tsEnd).subtract(20, 'minutes');
    return {
      range: {
        'monitor.timespan': {
          gte: tsStart.toISOString(),
          lte: tsEnd.toISOString()
        }
      }
    };
  }
  async hasTimespan() {
    if (this.hasTimespanCache) {
      return this.hasTimespanCache;
    }
    this.hasTimespanCache = (await this.count({
      body: {
        query: {
          bool: {
            filter: [this.timespanClause()]
          }
        }
      },
      terminate_after: 1
    })).count > 0;
    return this.hasTimespanCache;
  }
  clone() {
    return new QueryContext(this.callES, this.dateRangeStart, this.dateRangeEnd, this.pagination, this.filterClause, this.size, this.statusFilter, this.query);
  }

  // Returns true if the order returned by the ES query matches the requested sort order.
  // This useful to determine if the results need to be reversed from their ES results order.
  // I.E. when navigating backwards using prevPagePagination (CursorDirection.Before) yet using a SortOrder.ASC.
  searchSortAligned() {
    if (this.pagination.cursorDirection === _runtime_types.CursorDirection.AFTER) {
      return this.pagination.sortOrder === _runtime_types.SortOrder.ASC;
    } else {
      return this.pagination.sortOrder === _runtime_types.SortOrder.DESC;
    }
  }
  cursorOrder() {
    return _runtime_types.CursorDirection[this.pagination.cursorDirection] === _runtime_types.CursorDirection.AFTER ? 'asc' : 'desc';
  }
}
exports.QueryContext = QueryContext;