"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _register_routes = require("./api/register_routes");
Object.keys(_register_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _register_routes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _register_routes[key];
    }
  });
});