"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _merge_all_fields_with_source = require("./merge_all_fields_with_source");
Object.keys(_merge_all_fields_with_source).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _merge_all_fields_with_source[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _merge_all_fields_with_source[key];
    }
  });
});
var _merge_missing_fields_with_source = require("./merge_missing_fields_with_source");
Object.keys(_merge_missing_fields_with_source).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _merge_missing_fields_with_source[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _merge_missing_fields_with_source[key];
    }
  });
});
var _get_strategy = require("./get_strategy");
Object.keys(_get_strategy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_strategy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_strategy[key];
    }
  });
});