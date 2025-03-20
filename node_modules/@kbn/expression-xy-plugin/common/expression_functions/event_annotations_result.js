"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventAnnotationsResult = eventAnnotationsResult;
var _i18n = require("../i18n");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function eventAnnotationsResult() {
  return {
    name: 'event_annotations_result',
    aliases: [],
    type: 'event_annotations_result',
    inputTypes: ['null'],
    help: _i18n.strings.getAnnotationLayerFnHelp(),
    args: {
      layers: {
        types: [_constants.EXTENDED_ANNOTATION_LAYER],
        multi: true,
        help: _i18n.strings.getAnnotationLayerFnHelp()
      },
      datatable: {
        types: ['datatable'],
        help: _i18n.strings.getAnnotationLayerFnHelp()
      }
    },
    fn: (input, args) => {
      return {
        ...args,
        type: 'event_annotations_result',
        layers: args.layers || [],
        datatable: args.datatable || {}
      };
    }
  };
}