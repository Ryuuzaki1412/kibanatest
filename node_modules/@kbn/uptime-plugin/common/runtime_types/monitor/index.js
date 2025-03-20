"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _locations = require("./locations");
Object.keys(_locations).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _locations[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locations[key];
    }
  });
});
var _state = require("./state");
Object.keys(_state).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _state[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _state[key];
    }
  });
});