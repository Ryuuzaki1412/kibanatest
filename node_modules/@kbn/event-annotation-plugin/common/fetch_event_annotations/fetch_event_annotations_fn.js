"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFetchEventAnnotationsMeta = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const getFetchEventAnnotationsMeta = () => ({
  name: 'fetch_event_annotations',
  aliases: [],
  type: 'datatable',
  inputTypes: ['kibana_context', 'null'],
  help: _i18n.i18n.translate('eventAnnotation.fetchEventAnnotations.description', {
    defaultMessage: 'Fetch event annotations'
  }),
  args: {
    groups: {
      types: ['event_annotation_group'],
      help: _i18n.i18n.translate('eventAnnotation.fetchEventAnnotations.args.annotationConfigs', {
        defaultMessage: 'Annotation configs'
      }),
      multi: true
    },
    interval: {
      required: true,
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.fetchEventAnnotations.args.interval.help', {
        defaultMessage: 'Interval to use for this aggregation'
      })
    }
  }
});
exports.getFetchEventAnnotationsMeta = getFetchEventAnnotationsMeta;