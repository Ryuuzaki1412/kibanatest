"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuntimeMappings = void 0;
var _indicator = require("../../common/types/indicator");
var _indicator_name = require("./indicator_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Prepare `runtime_mappings` used within TI search
 */
const createRuntimeMappings = () => ({
  [_indicator.RawIndicatorFieldId.Name]: {
    type: 'keyword',
    script: {
      source: (0, _indicator_name.threatIndicatorNamesScript)()
    }
  },
  [_indicator.RawIndicatorFieldId.NameOrigin]: {
    type: 'keyword',
    script: {
      source: (0, _indicator_name.threatIndicatorNamesOriginScript)()
    }
  }
});
exports.createRuntimeMappings = createRuntimeMappings;