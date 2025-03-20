"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _log_view = require("./log_view");
Object.keys(_log_view).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _log_view[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _log_view[key];
    }
  });
});