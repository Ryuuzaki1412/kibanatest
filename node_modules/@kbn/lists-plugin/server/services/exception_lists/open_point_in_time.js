"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openPointInTime = void 0;
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Opens a point in time (PIT) for either exception lists or exception list items.
 * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/point-in-time-api.html
 * @params namespaceType {string} "agnostic" or "single" depending on which namespace you are targeting
 * @params savedObjectsClient {object} The saved object client to delegate to
 * @params options {Object} The saved object PIT options
 * @return {SavedObjectsOpenPointInTimeResponse} The point in time (PIT)
 */
const openPointInTime = async ({
  namespaceType,
  savedObjectsClient,
  options
}) => {
  const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectTypes)({
    namespaceType: [namespaceType]
  });
  return savedObjectsClient.openPointInTimeForType(savedObjectType, options);
};
exports.openPointInTime = openPointInTime;