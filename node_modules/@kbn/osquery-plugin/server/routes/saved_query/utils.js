"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSavedQueryPrebuilt = exports.getPrebuiltSavedQueryIds = exports.getInstalledSavedQueriesMap = void 0;
var _lodash = require("lodash");
var _common = require("../../../common");
var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getInstalledSavedQueriesMap = async packageService => {
  const installation = await (packageService === null || packageService === void 0 ? void 0 : packageService.getInstallation(_common.OSQUERY_INTEGRATION_NAME));
  if (installation) {
    return (0, _lodash.reduce)(installation.installed_kibana, (acc, item) => {
      if (item.type === _types.savedQuerySavedObjectType) {
        return {
          ...acc,
          [item.id]: item
        };
      }
      return acc;
    }, {});
  }
  return {};
};
exports.getInstalledSavedQueriesMap = getInstalledSavedQueriesMap;
const getPrebuiltSavedQueryIds = async packageService => {
  const installation = await (packageService === null || packageService === void 0 ? void 0 : packageService.getInstallation(_common.OSQUERY_INTEGRATION_NAME));
  if (installation) {
    const installationSavedQueries = (0, _lodash.filter)(installation.installed_kibana, item => item.type === _types.savedQuerySavedObjectType);
    return (0, _lodash.map)(installationSavedQueries, 'id');
  }
  return [];
};
exports.getPrebuiltSavedQueryIds = getPrebuiltSavedQueryIds;
const isSavedQueryPrebuilt = async (packageService, savedQueryId) => {
  const installation = await (packageService === null || packageService === void 0 ? void 0 : packageService.getInstallation(_common.OSQUERY_INTEGRATION_NAME));
  if (installation) {
    const installationSavedQueries = (0, _lodash.find)(installation.installed_kibana, item => item.type === _types.savedQuerySavedObjectType && item.id === savedQueryId);
    return !!installationSavedQueries;
  }
  return false;
};
exports.isSavedQueryPrebuilt = isSavedQueryPrebuilt;