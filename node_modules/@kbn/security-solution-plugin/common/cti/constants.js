"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THREAT_PIT_KEEP_ALIVE = exports.REFERENCE = exports.OTHER_TI_DATASET_KEY = exports.MATCHED_TYPE = exports.MATCHED_ID = exports.MATCHED_FIELD = exports.MATCHED_ATOMIC = exports.LAST_SEEN = exports.INDICATOR_REFERENCE = exports.INDICATOR_MATCH_SUBFIELDS = exports.INDICATOR_MATCHED_TYPE = exports.INDICATOR_MATCHED_FIELD = exports.FIRST_SEEN = exports.FEED_NAME_PATH = exports.FEED_NAME = exports.EVENT_ENRICHMENT_INDICATOR_FIELD_MAP = exports.EVENT_DATASET = exports.ENRICHMENT_TYPES = exports.DEFAULT_EVENT_ENRICHMENT_TO = exports.DEFAULT_EVENT_ENRICHMENT_FROM = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MATCHED_ATOMIC = 'matched.atomic';
exports.MATCHED_ATOMIC = MATCHED_ATOMIC;
const MATCHED_FIELD = 'matched.field';
exports.MATCHED_FIELD = MATCHED_FIELD;
const MATCHED_ID = 'matched.id';
exports.MATCHED_ID = MATCHED_ID;
const MATCHED_TYPE = 'matched.type';
exports.MATCHED_TYPE = MATCHED_TYPE;
const INDICATOR_MATCH_SUBFIELDS = [MATCHED_ATOMIC, MATCHED_FIELD, MATCHED_TYPE];
exports.INDICATOR_MATCH_SUBFIELDS = INDICATOR_MATCH_SUBFIELDS;
const INDICATOR_MATCHED_FIELD = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_FIELD}`;
exports.INDICATOR_MATCHED_FIELD = INDICATOR_MATCHED_FIELD;
const INDICATOR_MATCHED_TYPE = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_TYPE}`;
exports.INDICATOR_MATCHED_TYPE = INDICATOR_MATCHED_TYPE;
const EVENT_DATASET = 'event.dataset';
exports.EVENT_DATASET = EVENT_DATASET;
const FIRST_SEEN = 'indicator.first_seen';
exports.FIRST_SEEN = FIRST_SEEN;
const LAST_SEEN = 'indicator.last_seen';
exports.LAST_SEEN = LAST_SEEN;
const REFERENCE = 'indicator.reference';
exports.REFERENCE = REFERENCE;
const FEED_NAME = 'feed.name';
exports.FEED_NAME = FEED_NAME;
const FEED_NAME_PATH = `threat.${FEED_NAME}`;
exports.FEED_NAME_PATH = FEED_NAME_PATH;
const INDICATOR_REFERENCE = `${_constants.ENRICHMENT_DESTINATION_PATH}.${REFERENCE}`;
exports.INDICATOR_REFERENCE = INDICATOR_REFERENCE;
let ENRICHMENT_TYPES;
exports.ENRICHMENT_TYPES = ENRICHMENT_TYPES;
(function (ENRICHMENT_TYPES) {
  ENRICHMENT_TYPES["InvestigationTime"] = "investigation_time";
  ENRICHMENT_TYPES["IndicatorMatchRule"] = "indicator_match_rule";
})(ENRICHMENT_TYPES || (exports.ENRICHMENT_TYPES = ENRICHMENT_TYPES = {}));
const EVENT_ENRICHMENT_INDICATOR_FIELD_MAP = {
  'file.hash.md5': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.file.hash.md5`,
  'file.hash.sha1': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.file.hash.sha1`,
  'file.hash.sha256': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.file.hash.sha256`,
  'file.pe.imphash': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.file.pe.imphash`,
  'file.elf.telfhash': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.file.elf.telfhash`,
  'file.hash.ssdeep': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.file.hash.ssdeep`,
  'source.ip': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.ip`,
  'destination.ip': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.ip`,
  'url.full': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.url.full`,
  'registry.path': `${_constants.DEFAULT_INDICATOR_SOURCE_PATH}.registry.path`
};
exports.EVENT_ENRICHMENT_INDICATOR_FIELD_MAP = EVENT_ENRICHMENT_INDICATOR_FIELD_MAP;
const DEFAULT_EVENT_ENRICHMENT_FROM = 'now-30d';
exports.DEFAULT_EVENT_ENRICHMENT_FROM = DEFAULT_EVENT_ENRICHMENT_FROM;
const DEFAULT_EVENT_ENRICHMENT_TO = 'now';
exports.DEFAULT_EVENT_ENRICHMENT_TO = DEFAULT_EVENT_ENRICHMENT_TO;
const OTHER_TI_DATASET_KEY = '_others_ti_';
exports.OTHER_TI_DATASET_KEY = OTHER_TI_DATASET_KEY;
const THREAT_PIT_KEEP_ALIVE = '5m';
exports.THREAT_PIT_KEEP_ALIVE = THREAT_PIT_KEEP_ALIVE;