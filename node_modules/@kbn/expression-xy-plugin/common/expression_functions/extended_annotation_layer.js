"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendedAnnotationLayerFunction = extendedAnnotationLayerFunction;
var _constants = require("../constants");
var _i18n = require("../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function extendedAnnotationLayerFunction() {
  return {
    name: _constants.EXTENDED_ANNOTATION_LAYER,
    aliases: [],
    type: _constants.EXTENDED_ANNOTATION_LAYER,
    inputTypes: ['null'],
    help: _i18n.strings.getAnnotationLayerFnHelp(),
    args: {
      simpleView: {
        types: ['boolean'],
        default: false,
        help: _i18n.strings.getAnnotationLayerSimpleViewHelp()
      },
      annotations: {
        types: ['manual_point_event_annotation', 'manual_range_event_annotation', 'query_point_event_annotation'],
        help: _i18n.strings.getAnnotationLayerAnnotationsHelp(),
        multi: true
      },
      layerId: {
        types: ['string'],
        help: _i18n.strings.getLayerIdHelp()
      }
    },
    fn: (input, args) => {
      var _args$annotations;
      return {
        type: _constants.EXTENDED_ANNOTATION_LAYER,
        ...args,
        annotations: (_args$annotations = args.annotations) !== null && _args$annotations !== void 0 ? _args$annotations : [],
        layerType: _constants.LayerTypes.ANNOTATIONS
      };
    }
  };
}