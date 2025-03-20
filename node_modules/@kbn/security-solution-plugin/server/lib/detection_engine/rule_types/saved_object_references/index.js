"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _inject_references = require("./inject_references");
Object.keys(_inject_references).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inject_references[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inject_references[key];
    }
  });
});
var _extract_references = require("./extract_references");
Object.keys(_extract_references).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _extract_references[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _extract_references[key];
    }
  });
});