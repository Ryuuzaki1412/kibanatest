"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _post_kibana_instance = require("./post_kibana_instance");
Object.keys(_post_kibana_instance).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_kibana_instance[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_kibana_instance[key];
    }
  });
});
var _post_kibana_instances = require("./post_kibana_instances");
Object.keys(_post_kibana_instances).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_kibana_instances[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_kibana_instances[key];
    }
  });
});
var _post_kibana_overview = require("./post_kibana_overview");
Object.keys(_post_kibana_overview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_kibana_overview[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_kibana_overview[key];
    }
  });
});