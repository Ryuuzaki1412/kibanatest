"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _datatable_column = require("./datatable_column");
Object.keys(_datatable_column).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _datatable_column[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _datatable_column[key];
    }
  });
});
var _datatable = require("./datatable");
Object.keys(_datatable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _datatable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _datatable[key];
    }
  });
});