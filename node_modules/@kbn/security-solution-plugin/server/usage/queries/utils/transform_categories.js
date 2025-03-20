"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformCategories = void 0;
var _transform_category_bucket = require("./transform_category_bucket");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a set of categories from a categorization aggregation this will
 * return those transformed.
 * @param categories The categories to transform
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/8.1/search-aggregations-bucket-categorize-text-aggregation.html
 * @returns the categories transformed
 */
const transformCategories = categories => {
  return categories.buckets.map(bucket => (0, _transform_category_bucket.transformCategoryBucket)(bucket));
};
exports.transformCategories = transformCategories;