"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _post_beats_overview = require("./post_beats_overview");
Object.keys(_post_beats_overview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_beats_overview[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_beats_overview[key];
    }
  });
});
var _post_beats_listing = require("./post_beats_listing");
Object.keys(_post_beats_listing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_beats_listing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_beats_listing[key];
    }
  });
});
var _post_beat_detail = require("./post_beat_detail");
Object.keys(_post_beat_detail).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _post_beat_detail[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _post_beat_detail[key];
    }
  });
});