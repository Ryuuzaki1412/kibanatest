"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMappingFilters = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMappingFilters = threatMapping => {
  const eventMappingFilter = {
    meta: {},
    query: {
      bool: {
        should: []
      }
    }
  };
  const indicatorMappingFilter = {
    meta: {},
    query: {
      bool: {
        should: []
      }
    }
  };
  return threatMapping.reduce((acc, threatMap) => {
    var _eventMappingFilter$q, _indicatorMappingFilt;
    const eventMustClause = {
      bool: {
        must: []
      }
    };
    const indicatorMustClause = {
      bool: {
        must: []
      }
    };
    threatMap.entries.forEach(entry => {
      eventMustClause.bool.must.push({
        exists: {
          field: entry.field
        }
      });
      indicatorMustClause.bool.must.push({
        exists: {
          field: entry.value
        }
      });
    });
    (_eventMappingFilter$q = eventMappingFilter.query) === null || _eventMappingFilter$q === void 0 ? void 0 : _eventMappingFilter$q.bool.should.push(eventMustClause);
    (_indicatorMappingFilt = indicatorMappingFilter.query) === null || _indicatorMappingFilt === void 0 ? void 0 : _indicatorMappingFilt.bool.should.push(indicatorMustClause);
    return acc;
  }, {
    eventMappingFilter,
    indicatorMappingFilter
  });
};
exports.getMappingFilters = getMappingFilters;