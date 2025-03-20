"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _get_policy_data_for_update = require("./get_policy_data_for_update");
Object.keys(_get_policy_data_for_update).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _get_policy_data_for_update[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_policy_data_for_update[key];
    }
  });
});