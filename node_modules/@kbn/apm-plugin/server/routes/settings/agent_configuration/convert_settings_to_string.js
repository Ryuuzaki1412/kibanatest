"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertConfigSettingsToString = convertConfigSettingsToString;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// needed for backwards compatability
// All settings except `transaction_sample_rate` and `transaction_max_spans` are stored as strings (they are stored as float and integer respectively)
function convertConfigSettingsToString(hit) {
  const {
    settings
  } = hit._source;
  const convertedConfigSettings = {
    ...settings,
    ...(settings !== null && settings !== void 0 && settings.transaction_sample_rate ? {
      transaction_sample_rate: settings.transaction_sample_rate.toString()
    } : {}),
    ...(settings !== null && settings !== void 0 && settings.transaction_max_spans ? {
      transaction_max_spans: settings.transaction_max_spans.toString()
    } : {})
  };
  return {
    ...hit,
    _source: {
      ...hit._source,
      settings: convertedConfigSettings
    }
  };
}