"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _post_cluster_setup_status = require("./post_cluster_setup_status");
Object.keys(_post_cluster_setup_status).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_cluster_setup_status[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_cluster_setup_status[key];
    }
  });
});
var _post_node_setup_status = require("./post_node_setup_status");
Object.keys(_post_node_setup_status).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_node_setup_status[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_node_setup_status[key];
    }
  });
});
var _post_disable_internal_collection = require("./post_disable_internal_collection");
Object.keys(_post_disable_internal_collection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_disable_internal_collection[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_disable_internal_collection[key];
    }
  });
});