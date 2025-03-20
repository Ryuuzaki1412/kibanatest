"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  invalidateAPIKeys: true,
  generateLogstashApiKey: true,
  canCreateLogstashApiKey: true
};
Object.defineProperty(exports, "canCreateLogstashApiKey", {
  enumerable: true,
  get: function () {
    return _logstash_api_keys.canCreateLogstashApiKey;
  }
});
Object.defineProperty(exports, "generateLogstashApiKey", {
  enumerable: true,
  get: function () {
    return _logstash_api_keys.generateLogstashApiKey;
  }
});
Object.defineProperty(exports, "invalidateAPIKeys", {
  enumerable: true,
  get: function () {
    return _security.invalidateAPIKeys;
  }
});
var _security = require("./security");
var _logstash_api_keys = require("./logstash_api_keys");
var _enrollment_api_key = require("./enrollment_api_key");
Object.keys(_enrollment_api_key).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _enrollment_api_key[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _enrollment_api_key[key];
    }
  });
});