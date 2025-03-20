"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultSearchParams = getDefaultSearchParams;
exports.getShardTimeout = getShardTimeout;
var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getShardTimeout(config) {
  const timeout = config.elasticsearch.shardTimeout.asMilliseconds();
  return timeout ? {
    timeout: `${timeout}ms`
  } : {};
}
async function getDefaultSearchParams(uiSettingsClient, options = {
  isPit: false
}) {
  const maxConcurrentShardRequests = await uiSettingsClient.get(_common.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS);
  const defaults = {
    max_concurrent_shard_requests: maxConcurrentShardRequests > 0 ? maxConcurrentShardRequests : undefined,
    track_total_hits: true
  };

  // If the request has a point-in-time ID attached, it can not include ignore_unavailable from {@link estypes.IndicesOptions}.
  // ES will reject the request as that option was set when the point-in-time was created.
  // Otherwise, this option allows search to not fail when the index/indices don't exist
  if (!options.isPit) {
    defaults.ignore_unavailable = true;
  }
  return defaults;
}