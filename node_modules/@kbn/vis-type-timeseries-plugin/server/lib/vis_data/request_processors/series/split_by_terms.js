"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByTerms = splitByTerms;
var _helpers = require("../../helpers");
var _basic_aggs = require("../../../../../common/basic_aggs");
var _get_buckets_path = require("../../helpers/get_buckets_path");
var _bucket_transform = require("../../helpers/bucket_transform");
var _fields_utils = require("../../../../../common/fields_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function splitByTerms(req, panel, series, esQueryConfig, seriesIndex) {
  return next => doc => {
    const termsIds = (0, _fields_utils.getFieldsForTerms)(series.terms_field);
    if (series.split_mode === 'terms' && termsIds.length) {
      const termsType = termsIds.length > 1 ? 'multi_terms' : 'terms';
      const orderByTerms = series.terms_order_by;
      termsIds.forEach(termsField => {
        (0, _fields_utils.validateField)(termsField, seriesIndex);
      });
      const direction = series.terms_direction || 'desc';
      const metric = series.metrics.find(item => item.id === orderByTerms);
      if (termsType === 'multi_terms') {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.terms`, termsIds.map(item => ({
          field: item
        })));
      } else {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.field`, termsIds[0]);
        if (series.terms_include) {
          (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.include`, series.terms_include);
        }
        if (series.terms_exclude) {
          (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.exclude`, series.terms_exclude);
        }
      }
      (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.size`, series.terms_size);
      if (series.terms_size <= 10) {
        // 25 is the default shard size set for size:10 by Elasticsearch.
        // Setting it to 25 for every size below 10 makes sure the shard size doesn't change for sizes 1-10, keeping the top terms stable.
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.shard_size`, 25);
      }
      if (metric && metric.type !== 'count' && ~_basic_aggs.basicAggs.indexOf(metric.type)) {
        const sortAggKey = `${orderByTerms}-SORT`;
        const fn = _bucket_transform.bucketTransform[metric.type];
        const bucketPath = (0, _get_buckets_path.getBucketsPath)(orderByTerms, series.metrics).replace(orderByTerms, sortAggKey);
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.order`, {
          [bucketPath]: direction
        });
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.aggs`, {
          [sortAggKey]: fn(metric)
        });
      } else if (['_key', '_count'].includes(orderByTerms)) {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.order`, {
          [orderByTerms]: direction
        });
      } else {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.${termsType}.order`, {
          _count: direction
        });
      }
    }
    return next(doc);
  };
}