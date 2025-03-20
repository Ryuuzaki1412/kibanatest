"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformCategoryBucket = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a category from a categorization aggregation this will
 * return it transformed.
 * @param bucket The category bucket to transform
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/8.1/search-aggregations-bucket-categorize-text-aggregation.html
 * @returns the bucket transformed
 */
const transformCategoryBucket = bucket => {
  return {
    message: bucket.key,
    count: bucket.doc_count
  };
};
exports.transformCategoryBucket = transformCategoryBucket;