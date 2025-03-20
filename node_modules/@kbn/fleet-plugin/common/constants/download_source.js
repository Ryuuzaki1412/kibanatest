"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE = exports.DEFAULT_DOWNLOAD_SOURCE_URI = exports.DEFAULT_DOWNLOAD_SOURCE_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Default source URI used to download Elastic Agent
const DEFAULT_DOWNLOAD_SOURCE_URI = 'https://artifacts.elastic.co/downloads/';
exports.DEFAULT_DOWNLOAD_SOURCE_URI = DEFAULT_DOWNLOAD_SOURCE_URI;
const DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE = 'ingest-download-sources';
exports.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE = DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE;
const DEFAULT_DOWNLOAD_SOURCE_ID = 'fleet-default-download-source';
exports.DEFAULT_DOWNLOAD_SOURCE_ID = DEFAULT_DOWNLOAD_SOURCE_ID;