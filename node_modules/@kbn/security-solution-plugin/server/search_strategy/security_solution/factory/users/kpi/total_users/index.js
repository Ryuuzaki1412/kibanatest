"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.totalUsersKpi = void 0;
var _fp = require("lodash/fp");
var _build_query = require("../../../../../../utils/build_query");
var _queryBuild_total_users_kpi = require("./query.build_total_users_kpi.dsl");
var _format_general_histogram_data = require("../../../common/format_general_histogram_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const totalUsersKpi = {
  buildDsl: options => (0, _queryBuild_total_users_kpi.buildTotalUsersKpiQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryBuild_total_users_kpi.buildTotalUsersKpiQuery)(options))]
    };
    const usersHistogram = (0, _fp.getOr)(null, 'aggregations.users_histogram.buckets', response.rawResponse);
    return {
      ...response,
      inspect,
      users: (0, _fp.getOr)(null, 'aggregations.users.value', response.rawResponse),
      usersHistogram: (0, _format_general_histogram_data.formatGeneralHistogramData)(usersHistogram)
    };
  }
};
exports.totalUsersKpi = totalUsersKpi;