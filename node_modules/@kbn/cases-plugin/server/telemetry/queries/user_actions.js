"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserActionsTelemetryData = void 0;
var _constants = require("../../../common/constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getUserActionsTelemetryData = async ({
  savedObjectsClient
}) => {
  const res = await (0, _utils.getCountsAndMaxData)({
    savedObjectsClient,
    savedObjectType: _constants.CASE_USER_ACTION_SAVED_OBJECT
  });
  return res;
};
exports.getUserActionsTelemetryData = getUserActionsTelemetryData;