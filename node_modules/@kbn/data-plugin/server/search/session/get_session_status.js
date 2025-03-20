"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSessionStatus = getSessionStatus;
var _moment = _interopRequireDefault(require("moment"));
var _common = require("../../../common");
var _types = require("./types");
var _get_search_status = require("./get_search_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function getSessionStatus(deps, session, config) {
  if (session.isCanceled === true) {
    return {
      status: _common.SearchSessionStatus.CANCELLED
    };
  }
  const now = (0, _moment.default)();
  if ((0, _moment.default)(session.expires).isBefore(now)) {
    return {
      status: _common.SearchSessionStatus.EXPIRED
    };
  }
  const searches = Object.values(session.idMapping);
  const searchStatuses = await Promise.all(searches.map(async s => {
    const status = await (0, _get_search_status.getSearchStatus)(deps.internalClient, s.id);
    return {
      ...s,
      ...status
    };
  }));
  if (searchStatuses.some(item => item.status === _types.SearchStatus.ERROR)) {
    const erroredSearches = searchStatuses.filter(s => s.status === _types.SearchStatus.ERROR);
    const errors = erroredSearches.map(s => s.error).filter(error => !!error);
    return {
      status: _common.SearchSessionStatus.ERROR,
      errors
    };
  } else if (searchStatuses.length > 0 && searchStatuses.every(item => item.status === _types.SearchStatus.COMPLETE)) {
    return {
      status: _common.SearchSessionStatus.COMPLETE
    };
  } else {
    return {
      status: _common.SearchSessionStatus.IN_PROGRESS
    };
  }
}