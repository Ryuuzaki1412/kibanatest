"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertsTelemetryData = void 0;
var _constants = require("../../../common/constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAlertsTelemetryData = async ({
  savedObjectsClient
}) => {
  const res = await (0, _utils.getCountsAndMaxData)({
    savedObjectsClient,
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT,
    filter: (0, _utils.getOnlyAlertsCommentsFilter)()
  });
  return res;
};
exports.getAlertsTelemetryData = getAlertsTelemetryData;