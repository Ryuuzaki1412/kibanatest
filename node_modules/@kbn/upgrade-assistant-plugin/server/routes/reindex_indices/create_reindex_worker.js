"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReindexWorker = createReindexWorker;
var _reindexing = require("../../lib/reindexing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createReindexWorker({
  logger,
  elasticsearchService,
  credentialStore,
  savedObjects,
  licensing,
  security
}) {
  const esClient = elasticsearchService.client;
  return _reindexing.ReindexWorker.create(savedObjects, credentialStore, esClient, logger, licensing, security);
}