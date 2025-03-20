"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceGroups = getServiceGroups;
var _service_groups = require("../../../common/service_groups");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceGroups({
  savedObjectsClient
}) {
  const result = await savedObjectsClient.find({
    type: _service_groups.APM_SERVICE_GROUP_SAVED_OBJECT_TYPE,
    page: 1,
    perPage: _service_groups.MAX_NUMBER_OF_SERVICE_GROUPS
  });
  return result.saved_objects.map(({
    id,
    attributes,
    updated_at: upatedAt
  }) => ({
    id,
    updatedAt: upatedAt ? Date.parse(upatedAt) : 0,
    ...attributes
  }));
}