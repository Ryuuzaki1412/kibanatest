"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchProfilerServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _common = require("../common");
var profileRoute = _interopRequireWildcard(require("./routes/profile"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SearchProfilerServerPlugin {
  constructor({
    logger
  }) {
    (0, _defineProperty2.default)(this, "licenseStatus", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    this.log = logger.get();
    this.licenseStatus = {
      valid: false
    };
  }
  setup({
    http
  }, {
    licensing
  }) {
    const router = http.createRouter();
    profileRoute.register({
      router,
      getLicenseStatus: () => this.licenseStatus,
      log: this.log
    });
    licensing.license$.subscribe(license => {
      const {
        state,
        message
      } = license.check(_common.PLUGIN.id, _common.PLUGIN.minimumLicenseType);
      const hasRequiredLicense = state === 'valid';
      if (hasRequiredLicense) {
        this.licenseStatus = {
          valid: true
        };
      } else {
        this.licenseStatus = {
          valid: false,
          message: message ||
          // Ensure that there is a message when license check fails
          _i18n.i18n.translate('xpack.searchProfiler.licenseCheckErrorMessage', {
            defaultMessage: 'License check failed'
          })
        };
        if (message) {
          this.log.info(message);
        }
      }
    });
  }
  start() {}
  stop() {}
}
exports.SearchProfilerServerPlugin = SearchProfilerServerPlugin;