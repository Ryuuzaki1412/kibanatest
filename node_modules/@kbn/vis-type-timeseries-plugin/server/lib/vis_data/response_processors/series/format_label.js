"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatLabel = formatLabel;
var _enums = require("../../../../../common/enums");
var _fields_utils = require("../../../../../common/fields_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function formatLabel(resp, panel, series, meta, extractFields, fieldFormatService, cachedIndexPatternFetcher, timezone) {
  return next => async results => {
    const {
      terms_field: termsField,
      split_mode: splitMode
    } = series;
    const termsIds = (0, _fields_utils.getFieldsForTerms)(termsField);
    const shouldFormatLabels =
    // no need to format labels for series_agg
    !series.metrics.some(m => m.type === _enums.TSVB_METRIC_TYPES.SERIES_AGG) && termsIds.length && splitMode === _enums.BUCKET_TYPES.TERMS &&
    // no need to format labels for markdown as they also used there as variables keys
    panel.type !== _enums.PANEL_TYPES.MARKDOWN;
    if (shouldFormatLabels) {
      const fetchedIndex = meta.dataViewId ? await cachedIndexPatternFetcher({
        id: meta.dataViewId
      }) : undefined;
      let fields = [];
      if (!(fetchedIndex !== null && fetchedIndex !== void 0 && fetchedIndex.indexPattern) && meta.indexPatternString) {
        fields = await extractFields(meta.indexPatternString);
      }
      const formatField = (0, _fields_utils.createCachedFieldValueFormatter)(fetchedIndex === null || fetchedIndex === void 0 ? void 0 : fetchedIndex.indexPattern, fields, fieldFormatService, {
        timezone
      });
      results.filter(({
        seriesId
      }) => series.id === seriesId).forEach(item => {
        const formatted = termsIds.map((i, index) => formatField(i, [item.label].flat()[index])).join(_fields_utils.MULTI_FIELD_VALUES_SEPARATOR);
        if (formatted) {
          item.label = formatted;
        }
      });
    }
    return next(results);
  };
}