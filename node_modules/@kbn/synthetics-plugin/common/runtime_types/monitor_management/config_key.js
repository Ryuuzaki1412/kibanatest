"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConfigKey", {
  enumerable: true,
  get: function () {
    return _monitor_management.ConfigKey;
  }
});
exports.ConfigKeyCodec = void 0;
var _t_enum = require("../../utils/t_enum");
var _monitor_management = require("../../constants/monitor_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ConfigKeyCodec = (0, _t_enum.tEnum)('ConfigKey', _monitor_management.ConfigKey);
exports.ConfigKeyCodec = ConfigKeyCodec;