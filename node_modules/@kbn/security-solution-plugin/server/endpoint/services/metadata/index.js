"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _endpoint_metadata_service = require("./endpoint_metadata_service");
Object.keys(_endpoint_metadata_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _endpoint_metadata_service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _endpoint_metadata_service[key];
    }
  });
});
var _errors = require("./errors");
Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _errors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _errors[key];
    }
  });
});