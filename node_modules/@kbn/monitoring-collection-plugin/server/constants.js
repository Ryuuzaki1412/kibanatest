"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_ALLOWLIST = exports.MONITORING_COLLECTION_BASE_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
const TYPE_ALLOWLIST = ['node_rules', 'cluster_rules', 'node_actions', 'cluster_actions'];
exports.TYPE_ALLOWLIST = TYPE_ALLOWLIST;
const MONITORING_COLLECTION_BASE_PATH = '/api/monitoring_collection';
exports.MONITORING_COLLECTION_BASE_PATH = MONITORING_COLLECTION_BASE_PATH;