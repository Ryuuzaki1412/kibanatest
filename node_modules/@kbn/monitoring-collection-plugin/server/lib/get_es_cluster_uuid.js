"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getESClusterUuid = getESClusterUuid;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getESClusterUuid(client) {
  const response = await client.asCurrentUser.info({
    filter_path: 'cluster_uuid'
  });
  return response === null || response === void 0 ? void 0 : response.cluster_uuid;
}