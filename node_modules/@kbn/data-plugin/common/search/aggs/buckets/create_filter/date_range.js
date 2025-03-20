"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterDateRange = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createFilterDateRange = (agg, {
  from,
  to
}) => {
  const filter = {};
  if (from) filter.gte = _momentTimezone.default.tz(from, agg.aggConfigs.timeZone).toISOString();
  if (to) filter.lt = _momentTimezone.default.tz(to, agg.aggConfigs.timeZone).toISOString();
  if (to && from) filter.format = 'strict_date_optional_time';
  return (0, _esQuery.buildRangeFilter)(agg.params.field, filter, agg.getIndexPattern());
};
exports.createFilterDateRange = createFilterDateRange;