"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildVisualizeQuery = buildVisualizeQuery;
var _lodash = require("lodash");
var _serialization = require("../../../../common/lib/serialization");
var _constants = require("../../../../common/constants");
var _get_interval_type = require("../lib/get_interval_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
input.search.request.body.query.bool.filter.range
 */
function buildRange({
  rangeFrom,
  rangeTo,
  timeField
}) {
  return {
    [timeField]: {
      gte: rangeFrom,
      lte: rangeTo,
      format: 'epoch_millis'
    }
  };
}
function buildAggsCount(body, dateAgg) {
  return {
    dateAgg
  };
}
function buildAggsNonCount(body, dateAgg) {
  dateAgg.aggs = {
    metricAgg: body.aggs.metricAgg
  };
  return {
    dateAgg
  };
}
function buildAggsCountTerms(body, dateAgg) {
  const bucketAgg = body.aggs.bucketAgg;
  bucketAgg.aggs = {
    dateAgg
  };
  return {
    bucketAgg
  };
}
function buildAggsNonCountTerms(body, dateAgg) {
  const bucketAgg = body.aggs.bucketAgg;
  const metricAgg = (0, _lodash.cloneDeep)(bucketAgg.aggs.metricAgg);
  dateAgg.aggs = {
    metricAgg
  };
  bucketAgg.aggs = {
    metricAgg,
    dateAgg
  };
  return {
    bucketAgg
  };
}
function buildAggs(body, {
  aggType,
  termField
}, dateAgg) {
  if (aggType === _constants.AGG_TYPES.COUNT && !Boolean(termField)) {
    return buildAggsCount(body, dateAgg);
  }
  if (aggType === _constants.AGG_TYPES.COUNT && Boolean(termField)) {
    return buildAggsCountTerms(body, dateAgg);
  }
  if (aggType !== _constants.AGG_TYPES.COUNT && !Boolean(termField)) {
    return buildAggsNonCount(body, dateAgg);
  }
  if (aggType !== _constants.AGG_TYPES.COUNT && Boolean(termField)) {
    return buildAggsNonCountTerms(body, dateAgg);
  }
}
function buildVisualizeQuery(watch, visualizeOptions, kibanaVersion) {
  const {
    index,
    timeWindowSize,
    timeWindowUnit,
    timeField,
    aggType,
    aggField,
    termField,
    termSize,
    termOrder
  } = watch;
  const watchInput = (0, _serialization.buildInput)({
    index,
    timeWindowSize,
    timeWindowUnit,
    timeField,
    aggType,
    aggField,
    termField,
    termSize,
    termOrder
  });
  const body = watchInput.search.request.body;
  const dateAgg = {
    date_histogram: {
      field: watch.timeField,
      time_zone: visualizeOptions.timezone,
      min_doc_count: 1
    }
  };
  if (kibanaVersion.major < 8) {
    // In 7.x we use the deprecated "interval" in date_histogram agg
    dateAgg.date_histogram.interval = visualizeOptions.interval;
  } else {
    // From 8.x we use the more precise "fixed_interval" or "calendar_interval"
    const intervalType = (0, _get_interval_type.getIntervalType)(visualizeOptions.interval);
    dateAgg.date_histogram[intervalType] = visualizeOptions.interval;
  }

  // override the query range
  body.query.bool.filter.range = buildRange({
    rangeFrom: visualizeOptions.rangeFrom,
    rangeTo: visualizeOptions.rangeTo,
    timeField: watch.timeField
  });
  body.aggs = buildAggs(body, watch, dateAgg);
  return body;
}