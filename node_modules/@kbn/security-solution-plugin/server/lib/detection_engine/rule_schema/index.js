"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _rule_alert_type = require("./model/rule_alert_type");
Object.keys(_rule_alert_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rule_alert_type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rule_alert_type[key];
    }
  });
});
var _rule_schemas = require("./model/rule_schemas");
Object.keys(_rule_schemas).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rule_schemas[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rule_schemas[key];
    }
  });
});