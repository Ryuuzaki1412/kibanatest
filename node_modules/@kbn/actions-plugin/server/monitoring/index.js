"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  registerClusterCollector: true,
  registerNodeCollector: true
};
Object.defineProperty(exports, "registerClusterCollector", {
  enumerable: true,
  get: function () {
    return _register_cluster_collector.registerClusterCollector;
  }
});
Object.defineProperty(exports, "registerNodeCollector", {
  enumerable: true,
  get: function () {
    return _register_node_collector.registerNodeCollector;
  }
});
var _register_cluster_collector = require("./register_cluster_collector");
var _register_node_collector = require("./register_node_collector");
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _in_memory_metrics = require("./in_memory_metrics");
Object.keys(_in_memory_metrics).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _in_memory_metrics[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _in_memory_metrics[key];
    }
  });
});