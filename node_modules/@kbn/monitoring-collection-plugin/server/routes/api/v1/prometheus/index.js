"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _get_metrics = require("./get_metrics");
Object.keys(_get_metrics).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_metrics[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_metrics[key];
    }
  });
});