"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PROMETHEUS_PATH", {
  enumerable: true,
  get: function () {
    return _prometheus.PROMETHEUS_PATH;
  }
});
Object.defineProperty(exports, "registerDynamicRoute", {
  enumerable: true,
  get: function () {
    return _dynamic_route.registerDynamicRoute;
  }
});
Object.defineProperty(exports, "registerV1PrometheusRoute", {
  enumerable: true,
  get: function () {
    return _prometheus.registerV1PrometheusRoute;
  }
});
var _dynamic_route = require("./dynamic_route");
var _prometheus = require("./prometheus");