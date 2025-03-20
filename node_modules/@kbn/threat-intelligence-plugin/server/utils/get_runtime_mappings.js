"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuntimeMappings = void 0;
var _indicator_name = require("./indicator_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRuntimeMappings = () => ({
  'threat.indicator.name': {
    type: 'keyword',
    script: {
      source: (0, _indicator_name.threatIndicatorNamesScript)()
    }
  },
  'threat.indicator.name_origin': {
    type: 'keyword',
    script: {
      source: (0, _indicator_name.threatIndicatorNamesOriginScript)()
    }
  }
});
exports.getRuntimeMappings = getRuntimeMappings;