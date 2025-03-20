"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _get_metrics_by_type = require("./get_metrics_by_type");
Object.keys(_get_metrics_by_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_metrics_by_type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_metrics_by_type[key];
    }
  });
});