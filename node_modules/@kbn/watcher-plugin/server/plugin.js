"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WatcherServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _semver = require("semver");
var _constants = require("../common/constants");
var _settings = require("./routes/api/settings");
var _indices = require("./routes/api/indices");
var _license = require("./routes/api/license");
var _watches = require("./routes/api/watches");
var _watch = require("./routes/api/watch");
var _register_list_fields_route = require("./routes/api/register_list_fields_route");
var _register_load_history_route = require("./routes/api/register_load_history_route");
var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class WatcherServerPlugin {
  constructor(ctx) {
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.ctx = ctx;
    this.logger = ctx.logger.get();
    this.license = new _shared_imports.License();
  }
  setup({
    http
  }, {
    features
  }) {
    this.license.setup({
      pluginName: _constants.PLUGIN.getI18nName(_i18n.i18n),
      logger: this.logger
    });
    const kibanaVersion = new _semver.SemVer(this.ctx.env.packageInfo.version);
    const router = http.createRouter();
    const routeDependencies = {
      router,
      license: this.license,
      lib: {
        handleEsError: _shared_imports.handleEsError
      },
      kibanaVersion
    };
    features.registerElasticsearchFeature({
      id: 'watcher',
      management: {
        insightsAndAlerting: ['watcher']
      },
      catalogue: ['watcher'],
      privileges: [{
        requiredClusterPrivileges: ['manage_watcher'],
        requiredIndexPrivileges: {
          [_constants.INDEX_NAMES.WATCHES]: ['read'],
          [_constants.INDEX_NAMES.WATCHER_HISTORY]: ['read']
        },
        ui: []
      }, {
        requiredClusterPrivileges: ['monitor_watcher'],
        requiredIndexPrivileges: {
          [_constants.INDEX_NAMES.WATCHES]: ['read'],
          [_constants.INDEX_NAMES.WATCHER_HISTORY]: ['read']
        },
        ui: []
      }]
    });
    (0, _register_list_fields_route.registerListFieldsRoute)(routeDependencies);
    (0, _register_load_history_route.registerLoadHistoryRoute)(routeDependencies);
    (0, _indices.registerIndicesRoutes)(routeDependencies);
    (0, _license.registerLicenseRoutes)(routeDependencies);
    (0, _settings.registerSettingsRoutes)(routeDependencies);
    (0, _watches.registerWatchesRoutes)(routeDependencies);
    (0, _watch.registerWatchRoutes)(routeDependencies);
  }
  start(core, {
    licensing
  }) {
    this.license.start({
      pluginId: _constants.PLUGIN.ID,
      minimumLicenseType: _constants.PLUGIN.MINIMUM_LICENSE_REQUIRED,
      licensing
    });
  }
  stop() {}
}
exports.WatcherServerPlugin = WatcherServerPlugin;