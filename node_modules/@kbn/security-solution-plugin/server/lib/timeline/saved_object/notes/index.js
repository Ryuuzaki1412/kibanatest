"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _saved_object = require("./saved_object");
Object.keys(_saved_object).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _saved_object[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _saved_object[key];
    }
  });
});