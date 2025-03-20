"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorRouteFromMonitorId = exports.format = void 0;
var _querystring = require("querystring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const format = ({
  pathname,
  query
}) => {
  return `${pathname}?${(0, _querystring.stringify)(query)}`;
};
exports.format = format;
const getMonitorRouteFromMonitorId = ({
  monitorId,
  dateRangeStart,
  dateRangeEnd,
  filters = {}
}) => format({
  pathname: `/app/uptime/monitor/${btoa(monitorId)}`,
  query: {
    dateRangeEnd,
    dateRangeStart,
    ...(Object.keys(filters).length ? {
      filters: JSON.stringify(Object.keys(filters).map(key => [key, filters[key]]))
    } : {})
  }
});
exports.getMonitorRouteFromMonitorId = getMonitorRouteFromMonitorId;