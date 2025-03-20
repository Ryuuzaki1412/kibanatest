"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN_NAME = exports.PLUGIN_ID = exports.FILE_SO_TYPE = exports.FILE_SHARE_SO_TYPE = exports.FILES_MANAGE_PRIVILEGE = exports.ES_FIXED_SIZE_INDEX_BLOB_STORE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The files plugin ID
 */
const PLUGIN_ID = 'files';
/**
 * The files plugin name
 */
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'files';

/**
 * Unique type name of the file saved object
 */
exports.PLUGIN_NAME = PLUGIN_NAME;
const FILE_SO_TYPE = 'file';
/**
 * Unique type name of the public file saved object
 */
exports.FILE_SO_TYPE = FILE_SO_TYPE;
const FILE_SHARE_SO_TYPE = 'fileShare';

/**
 * The name of the fixed size ES-backed blob store
 */
exports.FILE_SHARE_SO_TYPE = FILE_SHARE_SO_TYPE;
const ES_FIXED_SIZE_INDEX_BLOB_STORE = 'esFixedSizeIndex';
exports.ES_FIXED_SIZE_INDEX_BLOB_STORE = ES_FIXED_SIZE_INDEX_BLOB_STORE;
const FILES_MANAGE_PRIVILEGE = 'files:manageFiles';
exports.FILES_MANAGE_PRIVILEGE = FILES_MANAGE_PRIVILEGE;