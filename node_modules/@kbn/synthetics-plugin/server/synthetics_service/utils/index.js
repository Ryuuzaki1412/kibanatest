"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _secrets = require("./secrets");
Object.keys(_secrets).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _secrets[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _secrets[key];
    }
  });
});