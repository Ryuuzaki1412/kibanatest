"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatatableUtilitiesService = void 0;
var _bucket_agg_types = require("../search/aggs/buckets/bucket_agg_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class DatatableUtilitiesService {
  constructor(aggs, dataViews, fieldFormats) {
    this.aggs = aggs;
    this.dataViews = dataViews;
    this.fieldFormats = fieldFormats;
    this.getAggConfig = this.getAggConfig.bind(this);
    this.getDataView = this.getDataView.bind(this);
    this.getField = this.getField.bind(this);
    this.isFilterable = this.isFilterable.bind(this);
  }
  clearField(column) {
    delete column.meta.field;
  }
  clearFieldFormat(column) {
    delete column.meta.params;
  }
  async getAggConfig(column) {
    const dataView = await this.getDataView(column);
    if (!dataView) {
      return;
    }
    const {
      aggs
    } = await this.aggs.createAggConfigs(dataView, column.meta.sourceParams && [column.meta.sourceParams]);
    return aggs[0];
  }

  /**
   * Helper function returning the used interval, used time zone and applied time filters for data table column created by the date_histogramm agg type.
   * "auto" will get expanded to the actually used interval.
   * If the column is not a column created by a date_histogram aggregation of the esaggs data source,
   * this function will return undefined.
   */
  getDateHistogramMeta(column, defaults = {}) {
    var _column$meta$sourcePa;
    if (column.meta.source !== 'esaggs') {
      return;
    }
    if (((_column$meta$sourcePa = column.meta.sourceParams) === null || _column$meta$sourcePa === void 0 ? void 0 : _column$meta$sourcePa.type) !== _bucket_agg_types.BUCKET_TYPES.DATE_HISTOGRAM) {
      return;
    }
    const params = column.meta.sourceParams.params;
    let interval;
    if (params.used_interval && params.used_interval !== 'auto') {
      interval = params.used_interval;
    }
    return {
      interval,
      timeZone: params.used_time_zone || defaults.timeZone,
      timeRange: column.meta.sourceParams.appliedTimeRange
    };
  }
  async getDataView(column) {
    if (!column.meta.index) {
      return;
    }
    return this.dataViews.get(column.meta.index);
  }
  async getField(column) {
    if (!column.meta.field) {
      return;
    }
    const dataView = await this.getDataView(column);
    if (!dataView) {
      return;
    }
    return dataView.getFieldByName(column.meta.field);
  }
  getFieldFormat(column) {
    return this.fieldFormats.deserialize(column.meta.params);
  }
  getInterval(column) {
    var _column$meta$sourcePa2;
    const params = (_column$meta$sourcePa2 = column.meta.sourceParams) === null || _column$meta$sourcePa2 === void 0 ? void 0 : _column$meta$sourcePa2.params;
    return params === null || params === void 0 ? void 0 : params.interval;
  }

  /**
   * Helper function returning the used interval for data table column created by the histogramm agg type.
   * "auto" will get expanded to the actually used interval.
   * If the column is not a column created by a histogram aggregation of the esaggs data source,
   * this function will return undefined.
   */
  getNumberHistogramInterval(column) {
    var _column$meta$sourcePa3;
    if (column.meta.source !== 'esaggs') {
      return;
    }
    if (((_column$meta$sourcePa3 = column.meta.sourceParams) === null || _column$meta$sourcePa3 === void 0 ? void 0 : _column$meta$sourcePa3.type) !== _bucket_agg_types.BUCKET_TYPES.HISTOGRAM) {
      return;
    }
    const params = column.meta.sourceParams.params;
    if (!params.used_interval || typeof params.used_interval === 'string') {
      return;
    }
    return params.used_interval;
  }
  getTotalCount(table) {
    var _table$meta, _table$meta$statistic;
    return (_table$meta = table.meta) === null || _table$meta === void 0 ? void 0 : (_table$meta$statistic = _table$meta.statistics) === null || _table$meta$statistic === void 0 ? void 0 : _table$meta$statistic.totalCount;
  }
  hasPrecisionError(column) {
    var _column$meta$sourcePa4;
    return (_column$meta$sourcePa4 = column.meta.sourceParams) === null || _column$meta$sourcePa4 === void 0 ? void 0 : _column$meta$sourcePa4.hasPrecisionError;
  }
  isFilterable(column) {
    var _column$meta$sourcePa5;
    if (column.meta.source !== 'esaggs') {
      return false;
    }
    const aggType = this.aggs.types.get((_column$meta$sourcePa5 = column.meta.sourceParams) === null || _column$meta$sourcePa5 === void 0 ? void 0 : _column$meta$sourcePa5.type);
    return Boolean(aggType.createFilter);
  }
  setFieldFormat(column, fieldFormat) {
    column.meta.params = fieldFormat.toJSON();
  }
}
exports.DatatableUtilitiesService = DatatableUtilitiesService;