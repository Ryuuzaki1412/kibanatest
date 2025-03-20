"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _total_users = require("./total_users");
Object.keys(_total_users).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _total_users[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _total_users[key];
    }
  });
});