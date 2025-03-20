"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _timeline = require("./timeline");
Object.keys(_timeline).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _timeline[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _timeline[key];
    }
  });
});