"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMELINE_ID_REF_NAME = exports.SAVED_QUERY_TYPE = exports.SAVED_QUERY_ID_REF_NAME = exports.DATA_VIEW_ID_REF_NAME = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The reference name for the saved query ID field within the timeline saved object definition
 */
const SAVED_QUERY_ID_REF_NAME = 'savedQueryId';

/**
 * The reference name for the saved query ID field within the timeline saved object definition
 */
exports.SAVED_QUERY_ID_REF_NAME = SAVED_QUERY_ID_REF_NAME;
const DATA_VIEW_ID_REF_NAME = 'dataViewId';

/**
 * This needs to match the type of the saved query saved object. That type is defined here:
 * https://github.com/elastic/kibana/blob/main/src/plugins/data/public/query/saved_query/saved_query_service.ts#L54
 */
exports.DATA_VIEW_ID_REF_NAME = DATA_VIEW_ID_REF_NAME;
const SAVED_QUERY_TYPE = 'query';

/**
 * The reference name for the timeline ID field within the notes and pinned events saved object definition
 */
exports.SAVED_QUERY_TYPE = SAVED_QUERY_TYPE;
const TIMELINE_ID_REF_NAME = 'timelineId';
exports.TIMELINE_ID_REF_NAME = TIMELINE_ID_REF_NAME;