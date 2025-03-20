"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotationRequestParams = getAnnotationRequestParams;
var _i18n = require("@kbn/i18n");
var _get_interval = require("../get_interval");
var _constants = require("../../../../common/constants");
var _build_request_body = require("./build_request_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function getAnnotationRequestParams(req, panel, annotation, {
  esShardTimeout,
  esQueryConfig,
  capabilities,
  uiSettings,
  cachedIndexPatternFetcher
}) {
  var _annotationIndex$inde2, _annotationIndex$inde3;
  const annotationIndex = await cachedIndexPatternFetcher(annotation.index_pattern);
  const request = await (0, _build_request_body.buildAnnotationRequest)({
    req,
    panel,
    annotation,
    esQueryConfig,
    annotationIndex,
    capabilities,
    uiSettings,
    getMetaParams: async () => {
      var _ref, _annotation$time_fiel, _annotationIndex$inde;
      const maxBuckets = await uiSettings.get(_constants.UI_SETTINGS.MAX_BUCKETS_SETTING);
      const {
        min,
        max
      } = req.body.timerange;
      const timeField = (_ref = (_annotation$time_fiel = annotation.time_field) !== null && _annotation$time_fiel !== void 0 ? _annotation$time_fiel : (_annotationIndex$inde = annotationIndex.indexPattern) === null || _annotationIndex$inde === void 0 ? void 0 : _annotationIndex$inde.timeFieldName) !== null && _ref !== void 0 ? _ref : panel.time_field;
      return {
        timeField,
        ...(0, _get_interval.getInterval)(timeField, panel, annotationIndex, {
          min,
          max,
          maxBuckets
        })
      };
    }
  });
  return {
    index: annotationIndex.indexPatternString,
    body: {
      ...request,
      runtime_mappings: (_annotationIndex$inde2 = (_annotationIndex$inde3 = annotationIndex.indexPattern) === null || _annotationIndex$inde3 === void 0 ? void 0 : _annotationIndex$inde3.getComputedFields().runtimeFields) !== null && _annotationIndex$inde2 !== void 0 ? _annotationIndex$inde2 : {},
      timeout: esShardTimeout > 0 ? `${esShardTimeout}ms` : undefined
    },
    trackingEsSearchMeta: {
      requestId: annotation.id,
      requestLabel: _i18n.i18n.translate('visTypeTimeseries.annotationRequest.label', {
        defaultMessage: 'Annotation: {id}',
        values: {
          id: annotation.id
        }
      })
    }
  };
}