"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIME_UNITS = exports.REPOSITORY_TYPES = exports.REPOSITORY_PLUGINS_MAP = exports.PLUGIN_REPOSITORY_TYPES = exports.PLUGIN = exports.ON_PREM_REPOSITORY_TYPES = exports.MODULE_REPOSITORY_TYPES = exports.MAJOR_VERSION = exports.FEATURE_STATES_NONE_OPTION = exports.APP_SLM_CLUSTER_PRIVILEGES = exports.APP_RESTORE_INDEX_PRIVILEGES = exports.APP_REQUIRED_CLUSTER_PRIVILEGES = exports.API_BASE_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const basicLicense = 'basic';
const PLUGIN = {
  id: 'snapshot_restore',
  minimumLicenseType: basicLicense,
  getI18nName: i18n => {
    return i18n.translate('xpack.snapshotRestore.appName', {
      defaultMessage: 'Snapshot and Restore'
    });
  }
};
exports.PLUGIN = PLUGIN;
const MAJOR_VERSION = '8.0.0';
exports.MAJOR_VERSION = MAJOR_VERSION;
const API_BASE_PATH = '/api/snapshot_restore/';
exports.API_BASE_PATH = API_BASE_PATH;
let REPOSITORY_TYPES; // Deliberately do not include `source` as a default repository since we treat it as a flag
exports.REPOSITORY_TYPES = REPOSITORY_TYPES;
(function (REPOSITORY_TYPES) {
  REPOSITORY_TYPES["fs"] = "fs";
  REPOSITORY_TYPES["url"] = "url";
  REPOSITORY_TYPES["source"] = "source";
  REPOSITORY_TYPES["s3"] = "s3";
  REPOSITORY_TYPES["hdfs"] = "hdfs";
  REPOSITORY_TYPES["azure"] = "azure";
  REPOSITORY_TYPES["gcs"] = "gcs";
})(REPOSITORY_TYPES || (exports.REPOSITORY_TYPES = REPOSITORY_TYPES = {}));
const ON_PREM_REPOSITORY_TYPES = [REPOSITORY_TYPES.fs, REPOSITORY_TYPES.url];
exports.ON_PREM_REPOSITORY_TYPES = ON_PREM_REPOSITORY_TYPES;
const MODULE_REPOSITORY_TYPES = [REPOSITORY_TYPES.azure, REPOSITORY_TYPES.gcs, REPOSITORY_TYPES.s3];
exports.MODULE_REPOSITORY_TYPES = MODULE_REPOSITORY_TYPES;
const PLUGIN_REPOSITORY_TYPES = [REPOSITORY_TYPES.hdfs];
exports.PLUGIN_REPOSITORY_TYPES = PLUGIN_REPOSITORY_TYPES;
const REPOSITORY_PLUGINS_MAP = {
  'repository-hdfs': REPOSITORY_TYPES.hdfs
};
exports.REPOSITORY_PLUGINS_MAP = REPOSITORY_PLUGINS_MAP;
const APP_REQUIRED_CLUSTER_PRIVILEGES = ['cluster:admin/snapshot', 'cluster:admin/repository'];
exports.APP_REQUIRED_CLUSTER_PRIVILEGES = APP_REQUIRED_CLUSTER_PRIVILEGES;
const APP_RESTORE_INDEX_PRIVILEGES = ['monitor'];
exports.APP_RESTORE_INDEX_PRIVILEGES = APP_RESTORE_INDEX_PRIVILEGES;
const APP_SLM_CLUSTER_PRIVILEGES = ['manage_slm', 'cluster:monitor/state'];
exports.APP_SLM_CLUSTER_PRIVILEGES = APP_SLM_CLUSTER_PRIVILEGES;
const TIME_UNITS = {
  DAY: 'd',
  HOUR: 'h',
  MINUTE: 'm',
  SECOND: 's'
};
exports.TIME_UNITS = TIME_UNITS;
const FEATURE_STATES_NONE_OPTION = 'none';
exports.FEATURE_STATES_NONE_OPTION = FEATURE_STATES_NONE_OPTION;