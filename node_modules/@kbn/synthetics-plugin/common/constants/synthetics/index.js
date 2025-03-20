"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _rest_api = require("./rest_api");
Object.keys(_rest_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rest_api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rest_api[key];
    }
  });
});