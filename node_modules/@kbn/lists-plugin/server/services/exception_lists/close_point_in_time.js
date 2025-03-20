"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closePointInTime = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Closes a point in time (PIT) for either exception lists or exception list items.
 * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/point-in-time-api.html
 * @params pit {string} The point in time to close
 * @params savedObjectsClient {object} The saved objects client to delegate to
 * @return {SavedObjectsOpenPointInTimeResponse} The point in time (PIT)
 */
const closePointInTime = async ({
  pit,
  savedObjectsClient
}) => {
  return savedObjectsClient.closePointInTime(pit);
};
exports.closePointInTime = closePointInTime;