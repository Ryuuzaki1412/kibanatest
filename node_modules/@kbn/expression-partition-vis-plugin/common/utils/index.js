"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _consolidate_metric_columns = require("./consolidate_metric_columns");
Object.keys(_consolidate_metric_columns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _consolidate_metric_columns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _consolidate_metric_columns[key];
    }
  });
});