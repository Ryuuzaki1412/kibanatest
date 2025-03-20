"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _case_with_comments = require("./case_with_comments");
Object.keys(_case_with_comments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _case_with_comments[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _case_with_comments[key];
    }
  });
});