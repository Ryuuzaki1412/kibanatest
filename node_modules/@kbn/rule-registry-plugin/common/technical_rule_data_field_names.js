"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ruleDataUtils = require("@kbn/rule-data-utils");
Object.keys(_ruleDataUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ruleDataUtils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ruleDataUtils[key];
    }
  });
});