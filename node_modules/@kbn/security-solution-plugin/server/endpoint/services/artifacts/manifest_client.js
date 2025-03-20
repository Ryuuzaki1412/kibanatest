"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _common = require("../../../../common/endpoint/schema/common");
var _artifacts = require("../../lib/artifacts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ManifestClient {
  constructor(savedObjectsClient, schemaVersion) {
    (0, _defineProperty2.default)(this, "schemaVersion", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    this.savedObjectsClient = savedObjectsClient;
    const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(schemaVersion, _common.manifestSchemaVersion);
    if (errors != null || validated === null) {
      throw new Error(`Invalid manifest version: ${schemaVersion}`);
    }
    this.schemaVersion = validated;
  }
  getManifestId() {
    return `endpoint-manifest-${this.schemaVersion}`;
  }
  async getManifest() {
    return this.savedObjectsClient.get(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, this.getManifestId());
  }
  async createManifest(manifest) {
    return this.savedObjectsClient.create(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, {
      ...manifest,
      created: Date.now()
    }, {
      id: this.getManifestId()
    });
  }
  async updateManifest(manifest, opts) {
    return this.savedObjectsClient.update(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, this.getManifestId(), manifest, opts);
  }
  async deleteManifest() {
    return this.savedObjectsClient.delete(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, this.getManifestId());
  }
}
exports.ManifestClient = ManifestClient;