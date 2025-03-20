"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnapshotRestoreServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _common = require("../common");
var _services = require("./services");
var _routes = require("./routes");
var _lib = require("./lib");
var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SnapshotRestoreServerPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "apiRoutes", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    this.context = context;
    const {
      logger
    } = this.context;
    this.logger = logger.get();
    this.apiRoutes = new _routes.ApiRoutes();
    this.license = new _services.License();
  }
  setup({
    http
  }, {
    licensing,
    features,
    security,
    cloud
  }) {
    const pluginConfig = this.context.config.get();
    const router = http.createRouter();
    this.license.setup({
      pluginId: _common.PLUGIN.id,
      minimumLicenseType: _common.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.snapshotRestore.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: _common.PLUGIN.id,
      management: {
        data: [_common.PLUGIN.id]
      },
      catalogue: [_common.PLUGIN.id],
      privileges: [{
        requiredClusterPrivileges: [..._common.APP_REQUIRED_CLUSTER_PRIVILEGES],
        ui: []
      }]
    });
    this.apiRoutes.setup({
      router,
      license: this.license,
      config: {
        isSecurityEnabled: () => security !== undefined && security.license.isEnabled(),
        isCloudEnabled: cloud !== undefined && cloud.isCloudEnabled,
        isSlmEnabled: pluginConfig.slm_ui.enabled
      },
      lib: {
        handleEsError: _shared_imports.handleEsError,
        wrapEsError: _lib.wrapEsError
      }
    });
  }
  start() {}
}
exports.SnapshotRestoreServerPlugin = SnapshotRestoreServerPlugin;