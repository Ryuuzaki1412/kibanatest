"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.artifactService = exports.Artifact = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _axios = _interopRequireDefault(require("axios"));
var _admZip = _interopRequireDefault(require("adm-zip"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class Artifact {
  constructor() {
    (0, _defineProperty2.default)(this, "manifestUrl", void 0);
    (0, _defineProperty2.default)(this, "CDN_URL", 'https://artifacts.security.elastic.co');
    (0, _defineProperty2.default)(this, "AXIOS_TIMEOUT_MS", 10_000);
    (0, _defineProperty2.default)(this, "receiver", void 0);
    (0, _defineProperty2.default)(this, "esClusterInfo", void 0);
  }
  async start(receiver) {
    var _this$esClusterInfo, _this$esClusterInfo$v;
    this.receiver = receiver;
    this.esClusterInfo = await this.receiver.fetchClusterInfo();
    if ((_this$esClusterInfo = this.esClusterInfo) !== null && _this$esClusterInfo !== void 0 && (_this$esClusterInfo$v = _this$esClusterInfo.version) !== null && _this$esClusterInfo$v !== void 0 && _this$esClusterInfo$v.number) {
      const version = this.esClusterInfo.version.number.substring(0, this.esClusterInfo.version.number.indexOf('-')) || this.esClusterInfo.version.number;
      this.manifestUrl = `${this.CDN_URL}/downloads/kibana/manifest/artifacts-${version}.zip`;
    }
  }
  async getArtifact(name) {
    if (this.manifestUrl) {
      var _manifest$artifacts$n;
      const response = await _axios.default.get(this.manifestUrl, {
        timeout: this.AXIOS_TIMEOUT_MS,
        responseType: 'arraybuffer'
      });
      const zip = new _admZip.default(response.data);
      const entries = zip.getEntries();
      const manifest = JSON.parse(entries[0].getData().toString());
      const relativeUrl = (_manifest$artifacts$n = manifest.artifacts[name]) === null || _manifest$artifacts$n === void 0 ? void 0 : _manifest$artifacts$n.relative_url;
      if (relativeUrl) {
        const url = `${this.CDN_URL}${relativeUrl}`;
        const artifactResponse = await _axios.default.get(url, {
          timeout: this.AXIOS_TIMEOUT_MS
        });
        return artifactResponse.data;
      } else {
        throw Error(`No artifact for name ${name}`);
      }
    } else {
      var _this$esClusterInfo2, _this$esClusterInfo2$;
      throw Error(`No manifest url for version ${(_this$esClusterInfo2 = this.esClusterInfo) === null || _this$esClusterInfo2 === void 0 ? void 0 : (_this$esClusterInfo2$ = _this$esClusterInfo2.version) === null || _this$esClusterInfo2$ === void 0 ? void 0 : _this$esClusterInfo2$.number}`);
    }
  }
  getManifestUrl() {
    return this.manifestUrl;
  }
}
exports.Artifact = Artifact;
const artifactService = new Artifact();
exports.artifactService = artifactService;