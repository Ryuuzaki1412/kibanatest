"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpacesFilter = getSpacesFilter;
var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getSpacesFilter(spaceId) {
  return spaceId ? {
    term: {
      [_technical_rule_data_field_names.SPACE_IDS]: spaceId
    }
  } : undefined;
}