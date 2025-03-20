"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnsupportedApmServerSchema = getUnsupportedApmServerSchema;
var _fleet = require("../../../common/fleet");
var _apm_saved_object_constants = require("../../../common/apm_saved_object_constants");
var _translate_legacy_schema_paths = require("./translate_legacy_schema_paths");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getUnsupportedApmServerSchema({
  savedObjectsClient
}) {
  const {
    attributes
  } = await savedObjectsClient.get(_apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_ID);
  const apmServerSchema = JSON.parse(attributes.schemaJson);
  const translatedApmServerSchema = (0, _translate_legacy_schema_paths.translateLegacySchemaPaths)(apmServerSchema);
  const supportedSchemaPaths = Object.values(_fleet.INPUT_VAR_NAME_TO_SCHEMA_PATH);
  return Object.entries(translatedApmServerSchema).filter(([name]) => !supportedSchemaPaths.includes(name)).map(([key, value]) => ({
    key,
    value
  }));
}