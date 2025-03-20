"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usersKpiAuthentications = void 0;
var _fp = require("lodash/fp");
var _build_query = require("../../../../../../utils/build_query");
var _queryUsers_kpi_authentications = require("./query.users_kpi_authentications.dsl");
var _format_general_histogram_data = require("../../../common/format_general_histogram_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const usersKpiAuthentications = {
  buildDsl: options => (0, _queryUsers_kpi_authentications.buildUsersKpiAuthenticationsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryUsers_kpi_authentications.buildUsersKpiAuthenticationsQuery)(options))]
    };
    const authenticationsSuccessHistogram = (0, _fp.getOr)(null, 'aggregations.authentication_success_histogram.buckets', response.rawResponse);
    const authenticationsFailureHistogram = (0, _fp.getOr)(null, 'aggregations.authentication_failure_histogram.buckets', response.rawResponse);
    return {
      ...response,
      inspect,
      authenticationsSuccess: (0, _fp.getOr)(null, 'aggregations.authentication_success.doc_count', response.rawResponse),
      authenticationsSuccessHistogram: (0, _format_general_histogram_data.formatGeneralHistogramData)(authenticationsSuccessHistogram),
      authenticationsFailure: (0, _fp.getOr)(null, 'aggregations.authentication_failure.doc_count', response.rawResponse),
      authenticationsFailureHistogram: (0, _format_general_histogram_data.formatGeneralHistogramData)(authenticationsFailureHistogram)
    };
  }
};
exports.usersKpiAuthentications = usersKpiAuthentications;