"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _post_enterprise_search_overview = require("./post_enterprise_search_overview");
Object.keys(_post_enterprise_search_overview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_enterprise_search_overview[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_enterprise_search_overview[key];
    }
  });
});