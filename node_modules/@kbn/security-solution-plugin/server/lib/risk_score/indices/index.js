"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _delete_indices_route = require("./delete_indices_route");
Object.keys(_delete_indices_route).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _delete_indices_route[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _delete_indices_route[key];
    }
  });
});
var _create_index_route = require("./create_index_route");
Object.keys(_create_index_route).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _create_index_route[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _create_index_route[key];
    }
  });
});