"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventAnnotationGroup = eventAnnotationGroup;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function eventAnnotationGroup() {
  return {
    name: 'fetch_event_annotation',
    aliases: [],
    type: 'fetch_event_annotation',
    inputTypes: ['null'],
    help: _i18n.i18n.translate('eventAnnotation.fetch.description', {
      defaultMessage: 'Event annotation fetch'
    }),
    args: {
      group: {
        types: ['event_annotation_group'],
        help: _i18n.i18n.translate('eventAnnotation.group.args.annotationGroups', {
          defaultMessage: 'Annotation group'
        }),
        multi: true
      }
    },
    fn: (input, args) => {
      return {
        type: 'fetch_event_annotation',
        group: args.group
      };
    }
  };
}