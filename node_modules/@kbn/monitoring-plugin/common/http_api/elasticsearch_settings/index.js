"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _get_elasticsearch_settings_cluster = require("./get_elasticsearch_settings_cluster");
Object.keys(_get_elasticsearch_settings_cluster).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_elasticsearch_settings_cluster[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_elasticsearch_settings_cluster[key];
    }
  });
});
var _get_elasticsearch_settings_nodes = require("./get_elasticsearch_settings_nodes");
Object.keys(_get_elasticsearch_settings_nodes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_elasticsearch_settings_nodes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_elasticsearch_settings_nodes[key];
    }
  });
});
var _post_elasticsearch_settings_internal_monitoring = require("./post_elasticsearch_settings_internal_monitoring");
Object.keys(_post_elasticsearch_settings_internal_monitoring).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_elasticsearch_settings_internal_monitoring[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_elasticsearch_settings_internal_monitoring[key];
    }
  });
});
var _put_elasticsearch_settings_collection_enabled = require("./put_elasticsearch_settings_collection_enabled");
Object.keys(_put_elasticsearch_settings_collection_enabled).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _put_elasticsearch_settings_collection_enabled[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _put_elasticsearch_settings_collection_enabled[key];
    }
  });
});
var _put_elasticsearch_settings_collection_interval = require("./put_elasticsearch_settings_collection_interval");
Object.keys(_put_elasticsearch_settings_collection_interval).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _put_elasticsearch_settings_collection_interval[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _put_elasticsearch_settings_collection_interval[key];
    }
  });
});