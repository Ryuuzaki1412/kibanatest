"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserCommentsTelemetryData = void 0;
var _constants = require("../../../common/constants");
var _utils = require("../../client/utils");
var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getUserCommentsTelemetryData = async ({
  savedObjectsClient
}) => {
  const onlyUserCommentsFilter = (0, _utils.buildFilter)({
    filters: ['user'],
    field: 'type',
    operator: 'or',
    type: _constants.CASE_COMMENT_SAVED_OBJECT
  });
  const res = await (0, _utils2.getCountsAndMaxData)({
    savedObjectsClient,
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT,
    filter: onlyUserCommentsFilter
  });
  return res;
};
exports.getUserCommentsTelemetryData = getUserCommentsTelemetryData;