"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.systemPalette = systemPalette;
var _i18n = require("@kbn/i18n");
var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function systemPalette() {
  return {
    name: 'system_palette',
    aliases: [],
    type: 'palette',
    inputTypes: ['null'],
    help: _i18n.i18n.translate('charts.functions.systemPaletteHelpText', {
      defaultMessage: 'Creates a dynamic color palette.'
    }),
    args: {
      name: {
        types: ['string'],
        help: _i18n.i18n.translate('charts.functions.systemPalette.args.nameHelpText', {
          defaultMessage: 'Name of the palette in the palette list'
        }),
        options: _constants.paletteIds
      }
    },
    fn: (input, args) => {
      return {
        type: 'palette',
        name: args.name
      };
    }
  };
}