"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getFieldCapabilities: true,
  shouldReadFieldFromDocValues: true,
  createNoMatchingIndicesError: true
};
Object.defineProperty(exports, "createNoMatchingIndicesError", {
  enumerable: true,
  get: function () {
    return _errors.createNoMatchingIndicesError;
  }
});
Object.defineProperty(exports, "getFieldCapabilities", {
  enumerable: true,
  get: function () {
    return _field_capabilities.getFieldCapabilities;
  }
});
Object.defineProperty(exports, "shouldReadFieldFromDocValues", {
  enumerable: true,
  get: function () {
    return _field_capabilities.shouldReadFieldFromDocValues;
  }
});
var _field_capabilities = require("./field_capabilities");
var _errors = require("./errors");
var _merge_capabilities_with_fields = require("./merge_capabilities_with_fields");
Object.keys(_merge_capabilities_with_fields).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _merge_capabilities_with_fields[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _merge_capabilities_with_fields[key];
    }
  });
});
var _map_capabilities = require("./map_capabilities");
Object.keys(_map_capabilities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _map_capabilities[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _map_capabilities[key];
    }
  });
});