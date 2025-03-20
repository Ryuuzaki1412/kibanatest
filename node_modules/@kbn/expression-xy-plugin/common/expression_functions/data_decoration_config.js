"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataDecorationConfigFunction = void 0;
var _i18n = require("@kbn/i18n");
var _constants = require("../constants");
var _common_y_config_args = require("./common_y_config_args");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const dataDecorationConfigFunction = {
  name: _constants.DATA_DECORATION_CONFIG,
  aliases: [],
  type: _constants.DATA_DECORATION_CONFIG,
  help: _i18n.i18n.translate('expressionXY.dataDecorationConfig.help', {
    defaultMessage: `Configure the decoration of data`
  }),
  inputTypes: ['null'],
  args: {
    ..._common_y_config_args.commonDecorationConfigArgs
  },
  fn(input, args) {
    return {
      type: _constants.DATA_DECORATION_CONFIG,
      ...args
    };
  }
};
exports.dataDecorationConfigFunction = dataDecorationConfigFunction;