"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TINES_TITLE = exports.TINES_CONNECTOR_ID = exports.SUB_ACTION = exports.API_MAX_RESULTS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TINES_TITLE = 'Tines';
exports.TINES_TITLE = TINES_TITLE;
const TINES_CONNECTOR_ID = '.tines';
exports.TINES_CONNECTOR_ID = TINES_CONNECTOR_ID;
const API_MAX_RESULTS = 500;
exports.API_MAX_RESULTS = API_MAX_RESULTS;
let SUB_ACTION;
exports.SUB_ACTION = SUB_ACTION;
(function (SUB_ACTION) {
  SUB_ACTION["STORIES"] = "stories";
  SUB_ACTION["WEBHOOKS"] = "webhooks";
  SUB_ACTION["RUN"] = "run";
  SUB_ACTION["TEST"] = "test";
})(SUB_ACTION || (exports.SUB_ACTION = SUB_ACTION = {}));