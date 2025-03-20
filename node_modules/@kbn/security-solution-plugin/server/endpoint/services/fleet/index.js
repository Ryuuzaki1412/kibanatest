"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _endpoint_fleet_services_factory = require("./endpoint_fleet_services_factory");
Object.keys(_endpoint_fleet_services_factory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _endpoint_fleet_services_factory[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _endpoint_fleet_services_factory[key];
    }
  });
});